import PopppinsFont from 'components/utilities/PoppinsFont';

export default function Typography() {
  return (
    <>
      <PopppinsFont />
      <div className="p-6">
        <h1 className="typography-product-display">Design System Typography</h1>
        <div className="mt-10 space-y-10">
          <div>
            <h2 className="typography-product-heading text-color-brand-primary">Product</h2>
            <div className="mt-4 space-y-6">
              <div>
                <div className="typography-product-display">typography-product-display</div>
                <div className="text-brand-blue-500">Figma: Prod/Display</div>
              </div>
              <div>
                <div className="typography-product-heading">typography-product-heading</div>
                <div className="text-brand-blue-500">Figma: Prod/Heading D and Prod/Heading M</div>
                <div className="mt-2 text-brand-gray-500">
                  NOTE: We combine the class to a single{' '}
                  <span className="font-semibold">typography-product-heading</span>. There is a
                  separate <span className="font-semibold">typography-product-heading-desktop</span>{' '}
                  (Figma: Prod/Heading D) and{' '}
                  <span className="font-semibold">typography-product-heading-mobile</span> (Figma:
                  Prod/Heading M) that we combine for it to be mobile responsive.
                </div>
              </div>
              <div>
                <div className="typography-product-heading-compact">
                  typography-product-heading-compact
                </div>
                <div className="text-brand-blue-500">Figma: Prod/Heading D compact </div>
                <div className="mt-2 text-brand-gray-500">
                  NOTE: There is currently only a desktop version of this, but I've wrapped it into
                  .typography-product-heading-compact in case we add a mobile.
                </div>
              </div>
              <div>
                <div className="typography-product-subheading">typography-product-subheading</div>
                <div className="text-brand-blue-500">Figma: Prod/Subheading</div>
              </div>
              <div>
                <div className="typography-product-body-highlight">
                  typography-product-body-highlight
                </div>
                <div className="text-brand-blue-500">Figma: Prod/Body highlight</div>
              </div>
              <div>
                <div className="typography-product-button-label-large">
                  typography-product-button-label-large
                </div>
                <div className="text-brand-blue-500">Figma: Prod/Button label L M</div>
                <div className="mt-2 text-brand-gray-500">
                  NOTE: Label large and medium are currently the same
                </div>
              </div>
              <div>
                <div className="typography-product-button-label-medium">
                  typography-product-button-label-medium
                </div>
                <div className="text-brand-blue-500">Figma: Prod/Button label L M</div>
                <div className="mt-2 text-brand-gray-500">
                  NOTE: Label large and medium are currently the same
                </div>
              </div>
              <div>
                <div className="typography-product-body">typography-product-body</div>
                <div className="text-brand-blue-500">Figma: Prod/Body</div>
              </div>
              <div>
                <div className="typography-product-button-label-small">
                  typography-product-button-label-small
                </div>
                <div className="text-brand-blue-500">Figma: Prod/Button label S</div>
              </div>
              <div>
                <div className="typography-product-link">typography-product-link</div>
                <div className="text-brand-blue-500">Figma: Prod/Link</div>
              </div>
              <div>
                <div className="typography-product-element-label">
                  typography-product-element-label
                </div>
                <div className="text-brand-blue-500">Figma: Prod/Element label</div>
              </div>
              <div>
                <div className="typography-product-caption">typography-product-caption</div>
                <div className="text-brand-blue-500">Figma: Prod/Caption</div>
              </div>
              <div>
                <div className="typography-product-button-label-xs">
                  typography-product-button-label-xs
                </div>
                <div className="text-brand-blue-500">Figma: Prod/Button label XS</div>
              </div>
              <div>
                <div className="typography-product-chips-filters">
                  typography-product-chips-filters
                </div>
                <div className="text-brand-blue-500">Figma: Prod/Chips, Filters</div>
              </div>
              <div>
                <div className="typography-product-text-card">typography-product-text-card</div>
                <div className="text-brand-blue-500">Figma: Prod/Text in cards</div>
              </div>
              <div>
                <div className="typography-product-tabbar-mobile">
                  typography-product-tabbar-mobile
                </div>
                <div className="text-brand-blue-500">Figma: Prod/Tabbar Mobile</div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="typography-product-heading text-color-brand-primary">Informative</h2>
            <div className="mt-4 space-y-6">
              <div>
                <div className="typography-informative-display-mega-primary">
                  typography-informative-display-mega-primary
                </div>
                <div className="text-brand-blue-500">
                  Figma: Inf/Display Mega primary Desktop and Inf/Display Mega primary Mobile
                </div>
                <div className="mt-2 text-brand-gray-500">
                  NOTE: We combine the class to a single{' '}
                  <span className="font-semibold">typography-informative-display-mega-primary</span>
                  . There is a separate{' '}
                  <span className="font-semibold">
                    typography-informative-display-mega-primary-desktop
                  </span>{' '}
                  (Figma: Inf/Display primary Desktop) and{' '}
                  <span className="font-semibold">
                    typography-informative-display-mega-primary-mobile
                  </span>{' '}
                  (Figma: Inf/Display primary Mobile) that we combine for it to be mobile
                  responsive.
                </div>
              </div>
              <div>
                <div className="typography-informative-display-mega-secondary">
                  typography-informative-display-mega-secondary
                </div>
                <div className="text-brand-blue-500">
                  Figma: Inf/Display Mega secondary Desktop and Inf/Display Mega secondary Mobile
                </div>
                <div className="mt-2 text-brand-gray-500">
                  NOTE: We combine the class to a single{' '}
                  <span className="font-semibold">
                    typography-informative-display-mega-secondary
                  </span>
                  . There is a separate{' '}
                  <span className="font-semibold">
                    typography-informative-display-mega-secondary-desktop
                  </span>{' '}
                  (Figma: Inf/Display secondary Desktop) and{' '}
                  <span className="font-semibold">
                    typography-informative-display-mega-secondary-mobile
                  </span>{' '}
                  (Figma: Inf/Display secondary Mobile) that we combine for it to be mobile
                  responsive.
                </div>
              </div>
              <div>
                <div className="typography-informative-display-primary">
                  typography-informative-display-primary
                </div>
                <div className="text-brand-blue-500">
                  Figma: Inf/Display primary Desktop and Inf/Display primary Mobile
                </div>
                <div className="mt-2 text-brand-gray-500">
                  NOTE: We combine the class to a single{' '}
                  <span className="font-semibold">typography-informative-display-primary</span>.
                  There is a separate{' '}
                  <span className="font-semibold">
                    typography-informative-display-primary-desktop
                  </span>{' '}
                  (Figma: Inf/Display primary Desktop) and{' '}
                  <span className="font-semibold">
                    typography-informative-display-primary-mobile
                  </span>{' '}
                  (Figma: Inf/Display primary Mobile) that we combine for it to be mobile
                  responsive.
                </div>
              </div>
              <div>
                <div className="typography-informative-display-secondary">
                  typography-informative-display-secondary
                </div>
                <div className="text-brand-blue-500">
                  Figma: Inf/Display secondary Desktop and Inf/Display secondary Mobile
                </div>
                <div className="mt-2 text-brand-gray-500">
                  NOTE: We combine the class to a single{' '}
                  <span className="font-semibold">typography-informative-display-secondary</span>.
                  There is a separate{' '}
                  <span className="font-semibold">
                    typography-informative-display-secondary-desktop
                  </span>{' '}
                  (Figma: Inf/Display secondary Desktop) and{' '}
                  <span className="font-semibold">
                    typography-informative-display-secondary-mobile
                  </span>{' '}
                  (Figma: Inf/Display secondary Mobile) that we combine for it to be mobile
                  responsive.
                </div>
              </div>
              <div>
                <div className="typography-informative-heading">typography-informative-heading</div>
                <div className="text-brand-blue-500">Figma: Inf/Heading D and Inf/Heading M</div>
                <div className="mt-2 text-brand-gray-500">
                  NOTE: We combine the class to a single{' '}
                  <span className="font-semibold">typography-informative-heading</span>. There is a
                  separate{' '}
                  <span className="font-semibold">typography-informative-heading-desktop</span>{' '}
                  (Figma: Inf/Heading D) and{' '}
                  <span className="font-semibold">typography-informative-heading-mobile</span>{' '}
                  (Figma: Inf/Heading M) that we combine for it to be mobile responsive.
                </div>
              </div>
              <div>
                <div className="typography-informative-heading-compact-desktop">
                  typography-informative-heading-compact-desktop
                </div>
                <div className="text-brand-blue-500">Figma: Inf/Heading D compact</div>
                <div className="mt-2 text-brand-gray-500">NOTE: No mobile yet</div>
              </div>
              <div>
                <div className="typography-informative-subheading">
                  typography-informative-subheading
                </div>
                <div className="text-brand-blue-500">Figma: Inf/Subheading</div>
              </div>
              <div>
                <div className="typography-informative-quote">typography-informative-quote</div>
                <div className="text-brand-blue-500">Figma: Inf/Quote</div>
              </div>
              <div>
                <div className="typography-informative-subheading-compact">
                  typography-informative-subheading-compact
                </div>
                <div className="text-brand-blue-500">Figma: Inf/Subheading compac</div>
              </div>
              <div>
                <div className="typography-informative-body-highlight">
                  typography-informative-body-highlight
                </div>
                <div className="text-brand-blue-500">Figma: Inf/Body highlight</div>
              </div>
              <div>
                <div className="typography-informative-button-label">
                  typography-informative-button-label
                </div>
                <div className="text-brand-blue-500">Figma: Inf/Button label</div>
              </div>
              <div>
                <div className="typography-informative-body">typography-informative-body</div>
                <div className="text-brand-blue-500">Figma: Inf/Body</div>
              </div>
              <div>
                <div className="typography-informative-caption-highlight">
                  typography-informative-caption-highlight
                </div>
                <div className="text-brand-blue-500">Figma: Inf/Caption highlight</div>
              </div>
              <div>
                <div className="typography-informative-caption">typography-informative-caption</div>
                <div className="text-brand-blue-500">Figma: Inf/Caption</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
