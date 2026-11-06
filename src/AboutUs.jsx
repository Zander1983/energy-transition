
import "./AboutUs.css";

const researchers = [
    {
  name: "Cian Murtagh, M.Eng., C.Eng.",
  role: "Chartered Engineer | Lecturer, Atlantic Technological University",
  initials: "CM",
  image: "/cian.png",
  bio: `Cian is a Chartered Engineer with over 18 years of experience
  in mechanical engineering and ocean energy research. He is
  currently a Lecturer in Engineering and Electrical Sciences
  at Atlantic Technological University (ATU).

  His research focuses on energy policy, renewable energy
  integration and energy systems modelling. Combining
  theoretical expertise with practical industry experience,
  he specialises in applying engineering and computational
  methods to real-world energy challenges.

  His technical expertise includes Python programming,
  numerical modelling of wave energy converters (WECs),
  data analysis and advanced CAD design.`,
},

{
  name: "Dr Niall Burke",
  role: "Lecturer & Researcher | Technological University of the Shannon",
  initials: "NB",
  image: "/niall.png",
  bio: `Niall is a Lecturer in Mechanical Engineering at
  Technological University of the Shannon (TUS), where
  he has taught since 2008. He holds a Ph.D. in
  Sustainable Energy Engineering, with doctoral research
  investigating heat pump performance in Ireland's
  maritime climate.

  His research focuses on renewable energy systems,
  electricity grid stability, energy policy and the
  integration of variable renewable generation. He
  has a particular interest in wind energy curtailment
  and the potential for flexible electricity demand
  to improve grid efficiency and renewable energy
  utilisation.

  His recent research explores the use of flexible
  computing loads, including Bitcoin mining, to
  absorb surplus wind generation. He also teaches
  thermodynamics and energy systems and coordinates
  the B.Eng. (Hons.) in Mechanical Engineering with
  Energy programme at TUS.`,
},
  {
    name: "Mark Kelly",
    role: "Data Scientist",
    initials: "MK",
    image: "/mark.png",
    bio: `Mark is an energy transition researcher at the
    Sustainable Development Research Institute, Technological
    University of the Shannon. He has a background in data
    science and software engineering, with over 15 years'
    experience in the tech start-up sector.

    His research focuses on energy systems, the feasibility
    of the energy transition, and the relationship between
    energy, agriculture and the wider economy. He holds
    an MSc in Renewable Energy Systems and has published
    research on renewable energy modelling and the energy
    requirements of Irish agriculture.`,
  },

  
{
  name: "Marcel Sarnecki",
  role: "Mechanical Engineer & Renewable Energy Researcher | Technological University of the Shannon",
  initials: "MS",
  image: "/marcel.png",
  bio: `Marcel is a Mechanical Engineer and postgraduate researcher
  at Technological University of the Shannon (TUS). He holds
  a First Class Honours degree in Mechanical Engineering
  and is pursuing postgraduate research in renewable energy,
  with a Ph.D. transfer in progress.

  His research focuses on wind energy dispatch-down and
  strategies to reduce renewable electricity losses on
  the island of Ireland. Working with Dr Niall Burke,
  he investigates the causes and geographical distribution
  of wind energy constraints and curtailment, using
  electricity system data and computational modelling.

  His technical expertise includes Python programming,
  data analysis, geospatial modelling and renewable energy
  visualisation. He has also developed TerraWatt, a
  geospatial application combining wind resource data
  and electricity grid infrastructure to identify
  promising locations for renewable energy development.`,
},

];

function ProfilePhoto({ person }) {
  return (
    <div className="west-profile-photo">
      <img
        src={person.image}
        alt={person.name}
        onError={(event) => {
          event.currentTarget.style.display = "none";
          event.currentTarget.nextElementSibling.style.display = "flex";
        }}
      />

      <div className="west-profile-placeholder">
        {person.initials}
      </div>
    </div>
  );
}

export default function AboutUs() {
  return (
    <div className="west-about-page">
      <div className="west-about-inner">

        <header className="west-about-header">
          <h1>About WEST</h1>

          <p className="west-about-subtitle">
            Whole Energy Systems &amp; Transition Research
          </p>
        </header>

        <section className="west-about-intro">
          <p>
            WEST is an independent research group examining
            Ireland's energy transition. We look beyond
            electricity to the wider energy system,
            investigating what is changing, what isn't,
            and whether Ireland's energy plans can deliver.
          </p>
        </section>

        <section className="west-about-team">
          <h2>Our Researchers</h2>

          <div className="west-profile-list">
            {researchers.map((person) => (
              <article
                className="west-profile"
                key={person.name}
              >
                <ProfilePhoto person={person} />

                <div className="west-profile-content">
                  <h3>{person.name}</h3>

                  <p className="west-profile-role">
                    {person.role}
                  </p>

                  {person.bio
                    .trim()
                    .split(/\n\s*\n/)
                    .map((paragraph, index) => (
                      <p key={index}>
                        {paragraph.replace(/\s+/g, " ").trim()}
                      </p>
                    ))}
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
