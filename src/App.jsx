
import { useState } from "react";
import EnergyTransitionTracker from "./EnergyTransitionTracker.jsx";
import "./App.css";
import "./Home.css";

// Temporary photography.
// These can later be replaced with images in public/images.
const images = {
  hero: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1800&q=85",
  grid: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=85",
  wind: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=85",
  landscape: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&q=85",
};

const principles = [
  {
    number: "01",
    title: "Whole-system thinking",
    description:
      "Considering electricity, heat, transport, agriculture, industry and their interdependencies.",
  },
  {
    number: "02",
    title: "Open and reproducible",
    description:
      "Publishing data, code, assumptions and methods wherever possible, so our findings can be independently examined.",
  },
  {
    number: "03",
    title: "Technology-neutral",
    description:
      "Evaluating technologies and transition pathways on evidence rather than predetermined preferences.",
  },
  {
    number: "04",
    title: "Physical and economic realism",
    description:
      "Testing what can actually be delivered, at what pace, and at what full-system cost.",
  },
];

const researchAreas = [
  {
    number: "01",
    title: "Energy systems modelling",
    description:
      "Modelling Ireland's electricity system, including generation, storage, grid constraints, dispatch-down, interconnection and the growth of demand from electrification.",
    image: images.grid,
  },
  {
    number: "02",
    title: "Decarbonisation pathways",
    description:
      "Examining alternative pathways for reducing fossil fuel dependence, comparing achievable deployment rates with national energy and climate targets.",
    image: images.wind,
  },
  {
    number: "03",
    title: "Resources and infrastructure",
    description:
      "Investigating the infrastructure, firm generation, storage, materials, embodied energy and investment needed to support Ireland's transition.",
    image: images.landscape,
  },
  {
    number: "04",
    title: "Policy and delivery",
    description:
      "Assessing whether national plans, regulatory decisions and infrastructure development are aligned, and identifying barriers between policy ambition and delivery.",
    image: images.grid,
  },
];

function Home({ navigate }) {
  return (
    <div className="west-home">

      {/* HERO */}
      <section
        className="west-hero"
        style={{
          backgroundImage: `url("${images.hero}")`,
        }}
      >
        <div className="west-hero-content">

          <div className="west-eyebrow">
            WHOLE ENERGY SYSTEMS & TRANSITION RESEARCH GROUP
          </div>

          <h1>
            Decarbonising Ireland's energy system.
          </h1>

          <p className="west-hero-subtitle">
            A whole-systems approach.
          </p>

          <p className="west-hero-description">
            WEST is an independent research group dedicated
            to supporting the decarbonisation of Ireland's
            entire energy system. Through transparent data,
            open modelling and evidence-based analysis, we
            investigate how Ireland can transition away from
            fossil fuels while addressing the physical,
            economic and infrastructural challenges involved.
          </p>

          <div className="west-actions">

            <button
              className="west-primary-button"
              onClick={() => navigate("tracker")}
            >
              Explore the Energy Transition Tracker →
            </button>

            <a
              className="west-secondary-button"
              href="#mission"
            >
              Our mission
            </a>

          </div>
        </div>
      </section>

      {/* RESEARCH PRINCIPLES */}
      <section className="west-principles">

        {principles.map((principle) => (
          <div
            className="west-principle"
            key={principle.number}
          >
            <span className="west-principle-number">
              {principle.number} /
            </span>

            <h3>{principle.title}</h3>

            <p>{principle.description}</p>
          </div>
        ))}

      </section>

      {/* MISSION */}
      <section
        id="mission"
        className="west-mission"
      >

        <div className="west-section-label">
          OUR MISSION
        </div>

        <div className="west-mission-layout">

          <h2>
            Our goal is the decarbonisation of Ireland's
            energy system through a whole-systems approach.
          </h2>

          <div>

            <p>
              Decarbonising Ireland requires more than
              generating renewable electricity. Fossil fuels
              remain deeply embedded in transport, heating,
              agriculture, industry and the wider economy.
            </p>

            <p>
              WEST — Whole Energy Systems & Transition
              Research Group — brings together researchers
              and energy professionals to understand how
              these interconnected systems can transition
              towards a sustainable, low-carbon future.
            </p>

            <p>
              We investigate what is technically achievable,
              what infrastructure and resources are required,
              what different pathways will cost, and whether
              current policies can deliver their stated
              objectives.
            </p>

            <p>
              Our research is technology-neutral, transparent
              and grounded in physical evidence. We publish
              assumptions, methods and uncertainties, and
              allow the findings to inform our conclusions.
            </p>

            <p>
              Our initial modelling work focuses on Ireland's
              electricity system, including grid constraints,
              renewable generation, storage, interconnection
              and future demand. Our wider ambition encompasses
              the entire energy system.
            </p>

          </div>
        </div>
      </section>

      {/* RESEARCH FOCUS */}
      <section className="west-research">

        <div className="west-section-heading">

          <div>
            <div className="west-section-label">
              WHAT WE INVESTIGATE
            </div>

            <h2>Our research focus</h2>
          </div>

          <p>
            Understanding the interactions between energy
            demand, supply, infrastructure, resources and
            society.
          </p>

        </div>

        <div className="west-research-grid">

          {researchAreas.map((area) => (

            <article
              className="west-research-card"
              key={area.number}
            >

              <img
                src={area.image}
                alt=""
                loading="lazy"
              />

              <div className="west-card-body">

                <span>
                  {area.number} / RESEARCH AREA
                </span>

                <h3>{area.title}</h3>

                <p>{area.description}</p>

              </div>

            </article>

          ))}

        </div>

      </section>

      {/* RESEARCH APPROACH */}
      <section className="west-mission">

        <div className="west-section-label">
          HOW WE WORK
        </div>

        <div className="west-mission-layout">

          <h2>
            Questions, not conclusions.
          </h2>

          <div>

            <p>
              WEST begins with research questions rather
              than predetermined answers. Our objective is
              to establish what the evidence shows, even
              when the findings challenge established
              assumptions or expectations.
            </p>

            <p>
              We prioritise primary data sources, open-source
              modelling, reproducible methods and external
              review. Results are expressed in physical
              units, with uncertainty and sensitivity
              clearly stated.
            </p>

            <p>
              We aim to publish our research in peer-reviewed
              journals and make the underlying code, data
              and assumptions publicly accessible wherever
              possible.
            </p>

            <p>
              Our work is intended to inform researchers,
              policymakers, industry and the public about
              the opportunities and challenges of
              decarbonising Ireland's energy system.
            </p>

          </div>

        </div>

      </section>

      {/* TRACKER */}
      <section className="west-tracker-banner">

        <div>

          <div className="west-section-label">
            EXPLORE THE DATA
          </div>

          <h2>
            Ireland's Energy Transition Tracker
          </h2>

          <p>
            Explore historical energy consumption,
            renewable electricity generation and the
            underlying data through our interactive
            Energy Transition Tracker.
          </p>

        </div>

        <button
          className="west-primary-button"
          onClick={() => navigate("tracker")}
        >
          Open Tracker →
        </button>

      </section>

      {/* FOOTER */}
      <footer className="west-footer">

        <strong>WEST</strong>

        <span>
          Whole Energy Systems & Transition Research Group
        </span>

        <span>
          Independent, evidence-based energy research
        </span>

      </footer>

    </div>
  );
}

export default function App() {

  const [page, setPage] = useState("home");

  function navigate(nextPage) {
    setPage(nextPage);
    window.scrollTo(0, 0);
  }

  return (
    <>

      {/* SITE NAVIGATION */}
      <nav className="west-nav">

        <button
          className="west-brand"
          onClick={() => navigate("home")}
        >

          <span className="west-brand-name">
            WEST<span>.</span>
          </span>

          <span className="west-brand-description">
            Whole Energy Systems
            <br />
            & Transition Research Group
          </span>

        </button>

        <div className="west-nav-links">

          <button
            className={
              page === "home" ? "selected" : ""
            }
            onClick={() => navigate("home")}
          >
            Home
          </button>

          <button
            className={
              page === "tracker" ? "selected" : ""
            }
            onClick={() => navigate("tracker")}
          >
            Energy Transition Tracker
          </button>

        </div>

      </nav>

      {/* PAGE CONTENT */}
      {page === "home" ? (
        <Home navigate={navigate} />
      ) : (
        <EnergyTransitionTracker />
      )}

    </>
  );
}
