import { AgentButton } from '@/components/landing/ui/ActionButton';

export default function AgentBand() {
  return (
    <section className="section section--white agent-section">
      <div className="shell">
        <div className="agent-band">
          <span className="agent-band__avatar" aria-hidden="true">
            2%
          </span>
          <div className="agent-band__copy">
            <p className="eyebrow">2% Tech Agent</p>
            <h2 className="agent-band__title">Need help choosing the right format?</h2>
            <p className="agent-band__desc">
              The agent guides event creation, answers application questions, and routes
              high-value requests to a human when needed.
            </p>
          </div>
          <AgentButton className="btn btn--dark btn--lg agent-band__cta">
            Start a Conversation ↗
          </AgentButton>
        </div>
      </div>
    </section>
  );
}
