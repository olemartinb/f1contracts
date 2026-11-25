import { data } from './data';
import { formatDate } from './i18n';
import { adsense } from './config';
import { Page } from './components/Shell';

const ext = 'font-semibold text-flag underline-offset-4 hover:underline';

export default function Privacy() {
  const ads = Boolean(adsense.client);
  return (
    <Page crumbs={[{ name: 'Home', href: '/' }, { name: 'Privacy', href: '/privacy' }]}>
        <h1 className="font-cond text-5xl font-black uppercase italic leading-[0.9] sm:text-7xl">Privacy</h1>
        <p className="mt-4 text-muted">Last updated {formatDate(data.updated)}</p>

        <div className="mt-10 space-y-8 leading-relaxed [&_h2]:mb-2 [&_h2]:font-cond [&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:italic [&_p]:text-muted">
          <section>
            <h2>What this site collects</h2>
            <p>
              F1 Contracts has no accounts, forms or newsletters, and does not ask you for any personal information. What is
              collected comes from the services below.
            </p>
          </section>

          <section>
            <h2>Analytics</h2>
            <p>
              We use Cloudflare Web Analytics to count visits and see which pages are read. It does not use cookies, does not
              track you across sites and does not collect personal data. See{' '}
              <a className={ext} href="https://www.cloudflare.com/web-analytics/" target="_blank" rel="noopener">
                Cloudflare Web Analytics
              </a>
              .
            </p>
          </section>

          <section>
            <h2>Advertising</h2>
            {ads ? (
              <>
                <p>
                  Ads on this site are served by Google AdSense. Google and its partners may use cookies and similar
                  technology to show ads based on your visits to this and other websites, and to measure how ads perform.
                </p>
                <p className="mt-3">
                  If you visit from the EEA, the UK or Switzerland, you are asked for consent before personalised ads are
                  shown. You can change your choice at any time with the privacy link Google shows at the bottom of the page.
                  You can also turn off personalised ads in{' '}
                  <a className={ext} href="https://myadcenter.google.com/" target="_blank" rel="noopener">
                    My Ad Center
                  </a>
                  . Read{' '}
                  <a className={ext} href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">
                    how Google uses information from sites that use its services
                  </a>
                  .
                </p>
              </>
            ) : (
              <p>This site does not currently show ads.</p>
            )}
          </section>

          <section>
            <h2>Fonts and hosting</h2>
            <p>
              Fonts are loaded from Google Fonts, which receives your IP address when the page loads. The site is hosted on
              Cloudflare, which processes standard request data such as IP addresses to deliver and protect the site.
            </p>
          </section>

          <section>
            <h2>Changes</h2>
            <p>If this policy changes, the date at the top of this page is updated.</p>
          </section>
        </div>
    </Page>
  );
}
