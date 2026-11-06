
import { useState } from "react";
import EnergyTransitionTracker from "./EnergyTransitionTracker.jsx";
import AboutUs from "./AboutUs.jsx";
import "./App.css";
import "./Home.css";

const CONTACT_EMAIL = "westenergyireland@gmail.com";

export default function App() {
  const [page, setPage] = useState("home");

  function navigate(nextPage) {
    setPage(nextPage);
    window.scrollTo(0, 0);
  }

  return (
    <div className={`west-site ${page === "home" ? "west-home-mode" : ""}`}>
      <header className="west-nav">
        <button
          className="west-brand"
          onClick={() => navigate("home")}
          aria-label="WEST home"
        >
          WEST<span>.</span>
        </button>

        <nav className="west-nav-links" aria-label="Main navigation">
          <button
            className={page === "home" ? "selected" : ""}
            onClick={() => navigate("home")}
          >
            Home
          </button>

          <button
            className={page === "tracker" ? "selected" : ""}
            onClick={() => navigate("tracker")}
          >
            Ireland's Energy Transition
          </button>

          <button
            className={page === "about" ? "selected" : ""}
            onClick={() => navigate("about")}
          >
            About Us
          </button>

          <button
            className={page === "contact" ? "selected" : ""}
            onClick={() => navigate("contact")}
          >
            Contact
          </button>
        </nav>
      </header>

      {page === "home" && (
        <main className="west-simple-hero">
          <div className="west-simple-content">
            <h1>
              Whole Energy Systems Transition Group
            </h1>

            <div className="west-accent-line" />

            <p>
              We are an independent research group studying
              Ireland's energy transition, using energy data
              and system modelling to understand what's
              achievable, what's working and where the
              challenges lie.
            </p>

            <div className="west-simple-actions">
              <button
                className="west-primary-button"
                onClick={() => navigate("tracker")}
              >
                Ireland's Energy Transition →
              </button>

              <button
                className="west-outline-button"
                onClick={() => navigate("contact")}
              >
                Contact us
              </button>
            </div>
          </div>
        </main>
      )}

      {page === "tracker" && (
        <main className="west-tracker-page">
          <EnergyTransitionTracker />
        </main>
      )}

      {page === "about" && (
        <main className="west-about-wrapper">
          <AboutUs />
        </main>
      )}

      {page === "contact" && (
        <main className="west-contact-page">
          <div className="west-contact-content">
            <div className="west-small-label">
              GET IN TOUCH
            </div>

            <h1>Contact WEST</h1>

            <p>
              For research enquiries, collaboration
              opportunities or general correspondence,
              please contact us at:
            </p>

            <a href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
        </main>
      )}

      <footer className="west-simple-footer">
        <span>
          © {new Date().getFullYear()} WEST
        </span>

        <span>
          Whole Energy Systems Transition Group
        </span>
      </footer>
    </div>
  );
}
