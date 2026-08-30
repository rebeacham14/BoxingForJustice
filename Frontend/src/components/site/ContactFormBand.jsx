import ContactForm from './ContactForm';

export default function ContactFormBand() {
  return (
    <section className="contact-band">
      <div>
        <p className="eyebrow"><span /> Still have a question?</p>
        <h2>Send us<br />a note.</h2>
      </div>
      <div className="contact-band-form">
        <ContactForm type="general" submitLabel="Send message" />
      </div>
    </section>
  );
}
