import './Footer.css';

export default function Footer({ full_report_url, more_reports_url }) {
  return (
    <div className="footer_container">
      <div className="footer_content">
        <figure className="footer_quote_section">
          <blockquote className="footer_quote">When the Strait of Hormuz is strangled, the world&rsquo;s poorest and most vulnerable cannot breathe.</blockquote>
          <figcaption className="footer_attribution">
            <strong className="footer_name">António Guterres</strong>Secretary-General of the United Nations
          </figcaption>
        </figure>
        <div className="footer_ctas">
          <a className="footer_download_btn" href={full_report_url} rel="noopener" target="_blank">
            <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 3v12m-5-5 5 5 5-5M5 21h14" />
            </svg>
            Download the report (PDF)
          </a>
          <a className="footer_more_link" href={more_reports_url} rel="noopener" target="_blank">
            More UNCTAD publications on the Strait of Hormuz
            <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 16 16">
              <path d="M3 8h10m-4-4 4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
