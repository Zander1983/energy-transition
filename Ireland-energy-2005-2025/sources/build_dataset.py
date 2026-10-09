import json, pathlib, csv, zipfile, warnings
warnings.filterwarnings('ignore',category=UserWarning)
import openpyxl
ROOT=pathlib.Path(__file__).parent
OUT=ROOT.parent;OUT.mkdir(exist_ok=True)
KTOE_TWH=41868/3600000
EIR='https://cms.eirgrid.ie/sites/default/files/publications/System-and-Renewable-Data-Summary-Report-V30.xlsx'
SEAI='https://www.seai.ie/sites/default/files/2025-05/National-Energy-Balance.xlsx'
API='https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/{}/JSON-stat/2.0/en'
def cube(name):return json.loads((ROOT/(name+'.json')).read_text())
def val(d,sel):
 idx=0
 for key,size in zip(d['id'],d['size']):
  choices=d['dimension'][key]['category']['index'];code=sel.get(key,'-')
  if code not in choices:return None
  idx=idx*size+choices.index(code)
 vs=d['value'];return vs.get(str(idx)) if isinstance(vs,dict) else vs[idx]
fleet=cube('THA10');weight={14:cube('THA14'),19:cube('THA19')}
wb=openpyxl.load_workbook(ROOT/'balance.xlsx',data_only=True)
ew=openpyxl.load_workbook(ROOT/'eirgrid.xlsx',data_only=True)
fm=list(ew['Fuel Mix & CO2'].values)
wind={r[1]:r[4]/1000 for r in ew['Wind Installed Capacities'].values if isinstance(r[1],int) and 2005<=r[1]<=2025}
years={};evidence=[]
def obs(y,path,v,unit,source,status='published'):
 evidence.append({'year':y,'field':path,'value':v,'unit':unit,'source':source,'status':status if v is not None else 'missing'})
 return v
for y in range(2005,2026):
 col=fm[154].index(y)
 def gen(row,name):return obs(y,'electricity.'+name,fm[row-1][col]/1000,'TWh/year',EIR)
 el={'existingCarbonFreeElectricity':gen(164,'existingCarbonFreeElectricity'),'existingGasElectricity':gen(163,'existingGasElectricity'),'existingCoalElectricity':gen(156,'existingCoalElectricity'),'existingPeatElectricity':gen(157,'existingPeatElectricity'),'existingOilElectricity':gen(158,'existingOilElectricity'),'existingNonRenewableWasteElectricity':gen(169,'existingNonRenewableWasteElectricity'),'netElectricityImports':gen(170,'netElectricityImports'),'totalElectricitySupply':gen(171,'totalElectricitySupply'),'windGenerationTWh':gen(166,'windGenerationTWh'),'solarGenerationTWh':gen(167,'solarGenerationTWh'),'hydroGenerationTWh':gen(165,'hydroGenerationTWh'),'otherRenewableGenerationTWh':gen(168,'otherRenewableGenerationTWh'),'currentWindCapacityGW':obs(y,'electricity.currentWindCapacityGW',wind[y],'GW',EIR),'currentSolarCapacityGW':None,'lowDemandDuringNightGW':None,'lowDemandDuringDayGW':None}
 sheet=wb[str(y) if y<2025 else '2025 Interim'];rows={str(r[0]).strip():r for r in sheet.values if r[0] is not None}
 def energy(row,cols,path):
  rr=rows[row];v=None if y==2025 else sum(rr[c-1] or 0 for c in cols)*KTOE_TWH
  return obs(y,path,v,'TWh/year',SEAI,'derived from published ktoe')
 fossilcols=[3,8,12,27]
 heat={'residentialHeat':energy('Residential',fossilcols,'heat.residentialHeat'),'commercialPublicHeat':energy('Commercial/Public Services*',fossilcols,'heat.commercialPublicHeat'),'industryHeat':energy('Industry*',fossilcols+[40],'heat.industryHeat')}
 heat['homeOfficeHeat']=None if y==2025 else heat['residentialHeat']+heat['commercialPublicHeat']
 road={}
 for key,code in [('cars','10'),('goodsVehicles','20'),('motorcycles','30'),('tractorsAndMachinery','40'),('smallPSVs','50'),('largePSVs','60'),('exemptVehicles','70'),('other','80')]:
  road[key]={}
  for prop,stat,mult,unit in [('numVehicles','THA10C1',1,'vehicles annual average'),('distance','THA10C3',1,'km/vehicle/year'),('vehicleKm','THA10C2',1000000,'vehicle-km/year')]:
   v=val(fleet,{'STATISTIC':stat,'TLIST(A1)':str(y),'C02875V03459':code});v=None if v is None else v*mult
   road[key][prop]=obs(y,'roadTransport.'+key+'.'+prop,v,unit,API.format('THA10'))
 goods=[]
 if 2008<=y<=2023:
  n=14 if y<=2014 else 19;d=weight[n]
  for code in ['1','2','3','4','5','6']:
   item={'unladenWeightBand':d['dimension']['C02662V03464']['category']['label'][code]}
   for prop,suffix,mult in [('numVehicles','01',1),('distance','03',1),('vehicleKm','02',1000000)]:
    sel={'STATISTIC':f'THA{n}C{suffix}','TLIST(A1)':str(y),'C02662V03464':code}
    if n==19:sel['C03788V04538']='IE0'
    v=val(d,sel);item[prop]=obs(y,'goodsByUnladenWeight.'+code+'.'+prop,None if v is None else v*mult,'vehicle-km/year' if prop=='vehicleKm' else ('vehicles' if prop=='numVehicles' else 'km/vehicle/year'),API.format('THA'+str(n)))
   goods.append(item)
 rail=energy('Rail',[21],'railDieselEnergyTWh');nav=energy('Navigation',[12],'shippingFuelEnergyTWh');bunk=obs(y,'internationalMarineBunkersTWh',rows['Mar. Bunkers'][42]*KTOE_TWH,'TWh/year',SEAI,'derived from published ktoe; interim in 2025' if y==2025 else 'derived from published ktoe')
 years[str(y)]={'year':y,'status':'incomplete: 2025 interim energy balance; mileage unavailable' if y==2025 else ('incomplete: CSO mileage unavailable' if y==2024 else 'published inputs; vehicle mapping unresolved'),'electricity':el,'heat':heat,'roadTransport':road,'goodsByUnladenWeight':goods,'railDieselEnergyTWh':rail,'railDiesel':None if rail is None else rail*1e9/(.84*12.75),'shippingFuelEnergyTWh':nav,'shippingDiesel':None if nav is None else nav*1e9/(.84*12.75),'internationalMarineBunkersTWh':bunk,'actualTotalFinalEnergyTWh':energy('Total Final Energy Consumption',[43],'actualTotalFinalEnergyTWh'),'cleanEnergyAvailableTWh':el['existingCarbonFreeElectricity'],'cleanEnergyRequiredTWh':None}
 # Validate complete electricity breakdown, avoiding component/subtotal duplication.
 parts=sum(el[k] for k in ['existingCarbonFreeElectricity','existingGasElectricity','existingCoalElectricity','existingPeatElectricity','existingOilElectricity','existingNonRenewableWasteElectricity','netElectricityImports'])
 assert abs(parts-el['totalElectricitySupply'])<.01,(y,parts,el['totalElectricitySupply'])
metadata={'country':'Ireland (Republic of Ireland, not all-island)','retrieved':'2026-10-04','units':'TWh/year, GW, litres diesel-equivalent/year, vehicles and kilometres','missingValue':None,'important':'Not a complete calculator-ready series. Null required-energy totals are intentional. Source observations retained without fabricated history.','sources':{'SEAI_balance':SEAI,'EirGrid_SEAI_electricity':EIR,'CSO_fleet':API.format('THA10'),'CSO_goods_2008_2014':API.format('THA14'),'CSO_goods_2015_2023':API.format('THA19')},'dieselEquivalentKWhPerLitre':.84*12.75,'ktoeToTWh':KTOE_TWH,'definitions':{'residentialHeat':'Residential coal + peat + petroleum + natural gas final consumption; excludes electricity, renewable fuels and ambient heat. Proxy for fossil heat, not end-use measurement.','commercialPublicHeat':'Commercial/public coal + peat + petroleum + natural gas final consumption.','industryHeat':'Industry coal + peat + petroleum + natural gas + non-renewable waste final consumption; fuel-use proxy, includes some non-heating uses.','railDiesel':'Diesel-equivalent volume derived from fossil rail diesel energy with calculator conversion; not measured litres. Biofuel and rail electricity excluded.','shippingDiesel':'Diesel-equivalent volume for domestic navigation petroleum use; excludes international marine bunkers and fisheries.','electricity':'SEAI electricity fuel mix supplied through EirGrid workbook; net exported generation, pumped hydro excluded; domestic renewable generation does not assign a clean share to imports.','smallPSVs':'Taxis/hackneys/limousines, NOT small buses.','tractorsAndMachinery':'Broad CSO category, not agricultural tractors alone; mileage flagged unreliable by CSO.','goodsByUnladenWeight':'Unladen weight bands, NOT gross-weight LGV/HGV classes. Requires an explicit mapping before use.'}}
(OUT/'ireland-energy-2005-2025.json').write_text(json.dumps({'metadata':metadata,'Ireland':years},indent=2,allow_nan=False))
(OUT/'ireland-energy-2005-2025.js').write_text('// Source data with explicit gaps; see README before using.\nexport const irelandEnergy = '+json.dumps({'metadata':metadata,'Ireland':years},indent=2,allow_nan=False)+';\n')
with (OUT/'source-observations.csv').open('w',newline='') as f:
 wr=csv.DictWriter(f,fieldnames=evidence[0].keys());wr.writeheader();wr.writerows(evidence)
with (OUT/'annual-summary.csv').open('w',newline='') as f:
 wr=csv.writer(f);wr.writerow(['year','cleanElectricityTWh','electricitySupplyTWh','residentialFossilHeatTWh','commercialPublicFossilHeatTWh','industryFossilFuelProxyTWh','railDieselTWh','domesticNavigationPetroleumTWh','privateCars','averageCarKm','carVehicleKm','status'])
 for y,d in years.items():wr.writerow([y,d['cleanEnergyAvailableTWh'],d['electricity']['totalElectricitySupply'],d['heat']['residentialHeat'],d['heat']['commercialPublicHeat'],d['heat']['industryHeat'],d['railDieselEnergyTWh'],d['shippingFuelEnergyTWh'],*d['roadTransport']['cars'].values(),d['status']])
print('Built',len(years),'years;',len(evidence),'source observations')
for y in ['2005','2023','2024','2025']:
 d=years[y];print(y,'renewables',d['cleanEnergyAvailableTWh'],'heat',d['heat'],'cars',d['roadTransport']['cars'])
