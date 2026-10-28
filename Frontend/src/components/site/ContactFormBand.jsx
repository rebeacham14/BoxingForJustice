import ContactForm from './ContactForm';
import EditableText from './EditableText';
import Movable from './Movable';

// Rendered inside SiteLayout's site-wide EditableRegion (slug "site").
export default function ContactFormBand() {
  return (
    <section className="contact-band">
      <div>
        <p className="eyebrow">
          <Movable id="site.contact-band.eyebrow-tick" /> <EditableText id="site.contact-band.eyebrow" defaultValue="Still have a question?" />
        </p>
        <h2>
          <EditableText id="site.contact-band.title-line1" defaultValue="Send us" /><br />
          <EditableText id="site.contact-band.title-line2" defaultValue="a note." />
        </h2>
      </div>
      <div className="contact-band-form">
        <ContactForm type="general" submitLabel="Send message" />
      </div>
    </section>
  );
}
