import colors from 'styles/colors.json';
import classNames from 'styles/utils/classNames';

const PrimitiveColor = ({
  color,
  name,
  colorClassName,
}: {
  color: string;
  name: string;
  colorClassName: string;
}) => (
  <div className="inline-flex flex-col">
    <div className={classNames('h-10 w-10 rounded-lg', !!colorClassName && colorClassName)}>
      &nbsp;
    </div>
    <div className="text-sm">{name}</div>
    <div className="text-sm text-brand-gray-500">{color}</div>
  </div>
);

export default function Colors() {
  return (
    <div className="p-6">
      <h1 className="typography-product-display">Design System Colors</h1>
      <p className="text-sm text-brand-gray-500">
        Link to primitives in Figma:{' '}
        <a
          href="https://www.figma.com/file/a59YgLycqFBLkKkV519Udr/Bounce-Design-System?type=design&node-id=135%3A1044&mode=design&t=kvjeySzDWKT5SNnA-1"
          target="_blank"
          className="underline"
        >
          View color primitives
        </a>
      </p>
      <p className="text-sm text-brand-gray-500">
        To use darkmode just add a color like this{' '}
        <span className="font-semibold">dark:text-color-text-darkmode-primary</span> and this should
        typically happen on every color that's applied
      </p>
      <div className="mt-6 space-y-10">
        <div>
          <h2 className="typography-product-heading">Text Colors</h2>

          <div className="grid grid-cols-4">
            <div>&nbsp;</div>
            <div>
              <h3 className="font-bold">Light mode</h3>
            </div>
            <div>&nbsp;</div>
            <div>
              <h3 className="font-bold">Dark mode</h3>
            </div>
          </div>
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">text-color-text-lightmode-primary</div>{' '}
                <div className="text-brand-gray-500">(figma: text-primary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-lightmode-primary">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-900</p>
              </div>
              <div>
                <div className="font-medium">text-color-text-darkmode-primary</div>{' '}
                <div className="text-brand-gray-500">(figma: text-primary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-darkmode-primary">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-25</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">text-color-text-lightmode-secondary</div>{' '}
                <div className="text-brand-gray-500">(figma: text-secondary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-lightmode-secondary">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-600</p>
              </div>
              <div>
                <div className="font-medium">text-color-text-darkmode-secondary</div>{' '}
                <div className="text-brand-gray-500">(figma: text-secondary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-darkmode-secondary">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-200</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">text-color-text-brand</div>{' '}
                <div className="text-brand-gray-500">(figma: brand)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-brand">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">fire-500</p>
              </div>
              <div>
                <div className="font-medium">text-color-text-brand</div>{' '}
                <div className="text-brand-gray-500">(figma: brand)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-brand">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">fire-500</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">text-color-text-lightmode-invert</div>{' '}
                <div className="text-brand-gray-500">(figma: text-invert)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-lightmode-invert">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-25</p>
              </div>
              <div>
                <div className="font-medium">text-color-text-darkmode-invert</div>{' '}
                <div className="text-brand-gray-500">(figma: text-invert)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-darkmode-invert">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-900</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">text-color-text-lightmode-placeholder</div>{' '}
                <div className="text-brand-gray-500">(figma: text-placeholder)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-lightmode-placeholder">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-500</p>
              </div>
              <div>
                <div className="font-medium">text-color-text-darkmode-placeholder</div>{' '}
                <div className="text-brand-gray-500">(figma: text-placeholder)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-darkmode-placeholder">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-300</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">text-color-text-lightmode-tertiary</div>{' '}
                <div className="text-brand-gray-500">(figma: text-tertiary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-lightmode-tertiary">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-400</p>
              </div>
              <div>
                <div className="font-medium">text-color-text-darkmode-tertiary</div>{' '}
                <div className="text-brand-gray-500">(figma: text-tertiary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-darkmode-tertiary">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-400</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">text-color-text-lightmode-disabled</div>{' '}
                <div className="text-brand-gray-500">(figma: text-disabled)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-lightmode-disabled">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-200</p>
              </div>
              <div>
                <div className="font-medium">text-color-text-darkmode-disabled</div>{' '}
                <div className="text-brand-gray-500">(figma: text-disabled)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-darkmode-disabled">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-600</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">text-color-text-lightmode-error</div>{' '}
                <div className="text-brand-gray-500">(figma: text-error)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-lightmode-error">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">red-500</p>
              </div>
              <div>
                <div className="font-medium">text-color-text-darkmode-error</div>{' '}
                <div className="text-brand-gray-500">(figma: text-error)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-darkmode-error">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">red-500</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">text-color-text-lightmode-icon</div>{' '}
                <div className="text-brand-gray-500">(figma: text-icon)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-lightmode-icon">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-400</p>
              </div>
              <div>
                <div className="font-medium">text-color-text-darkmode-icon</div>{' '}
                <div className="text-brand-gray-500">(figma: text-icon)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-text-darkmode-icon">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-400</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="typography-product-heading">Background / Surface Colors</h2>
          <p className="text-sm text-brand-gray-500">
            The design system uses the phrase "surface" for backgrounds. To match tailwind, we've
            changed the name to "bg"
          </p>
          <div className="mt-6 grid grid-cols-4">
            <div>&nbsp;</div>
            <div>
              <h3 className="font-bold">Light mode</h3>
            </div>
            <div>&nbsp;</div>
            <div>
              <h3 className="font-bold">Dark mode</h3>
            </div>
          </div>
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">bg-color-bg-lightmode-primary</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-primary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-lightmode-primary">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-0</p>
              </div>
              <div>
                <div className="font-medium">bg-color-bg-darkmode-primary</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-primary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-darkmode-primary">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-1000</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">bg-color-bg-lightmode-highlighted</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-highlighted)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-lightmode-highlighted">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-200</p>
              </div>
              <div>
                <div className="font-medium">bg-color-bg-darkmode-highlighted</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-highlighted)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-darkmode-highlighted">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-500</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">bg-color-bg-lightmode-secondary</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-secondary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-lightmode-secondary">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-50</p>
              </div>
              <div>
                <div className="font-medium">bg-color-bg-darkmode-secondary</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-secondary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-darkmode-secondary">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-800</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">bg-color-bg-lightmode-tertiary</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-tertiary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-lightmode-tertiary">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-25</p>
              </div>
              <div>
                <div className="font-medium">bg-color-bg-darkmode-tertiary</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-tertiary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-darkmode-tertiary">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-800</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">bg-color-bg-lightmode-invert</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-invert)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-lightmode-invert">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-1000</p>
              </div>
              <div>
                <div className="font-medium">bg-color-bg-darkmode-invert</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-invert)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-darkmode-invert">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-0</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">bg-color-bg-lightmode-invert</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-invert)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-lightmode-invert">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-1000</p>
              </div>
              <div>
                <div className="font-medium">bg-color-bg-darkmode-invert</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-invert)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-darkmode-invert">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-0</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">bg-color-bg-lightmode-brand</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-brand)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-lightmode-brand">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">fire-500</p>
              </div>
              <div>
                <div className="font-medium">bg-color-bg-darkmode-brand</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-brand)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-darkmode-brand">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">fire-500</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">bg-color-bg-lightmode-brand-secondary</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-brand-secondary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-lightmode-brand-secondary">
                  &nbsp;
                </div>
                <p className="text-sm text-brand-gray-500">fire-50</p>
              </div>
              <div>
                <div className="font-medium">bg-color-bg-darkmode-brand-secondary</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-brand-secondary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-darkmode-brand-secondary">
                  &nbsp;
                </div>
                <p className="text-sm text-brand-gray-500">fire-900</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">bg-color-bg-lightmode-input</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-input)</div>
              </div>
              <div>
                <div className="bg-color-bg-lightmode-input h-8 w-8 rounded-lg">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-50</p>
              </div>
              <div>
                <div className="font-medium">bg-color-bg-darkmode-input</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-input)</div>
              </div>
              <div>
                <div className="bg-color-bg-darkmode-input h-8 w-8 rounded-lg">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-800</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">bg-color-bg-lightmode-icon</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-icon)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-lightmode-icon">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-200</p>
              </div>
              <div>
                <div className="font-medium">bg-color-bg-darkmode-icon</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-icon)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-darkmode-icon">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-500</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">bg-color-bg-lightmode-icon-error</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-icon-error)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-lightmode-icon-error">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">red-500</p>
              </div>
              <div>
                <div className="font-medium">bg-color-bg-darkmode-icon-error</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-icon-error)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-darkmode-icon-error">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">red-500</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">bg-color-bg-lightmode-error</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-error)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-lightmode-error">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">red-100</p>
              </div>
              <div>
                <div className="font-medium">bg-color-bg-darkmode-error</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-error)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-darkmode-error">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">red-700</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">bg-color-bg-lightmode-error-secondary</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-error-secondary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-lightmode-error-secondary">
                  &nbsp;
                </div>
                <p className="text-sm text-brand-gray-500">red-100</p>
              </div>
              <div>
                <div className="font-medium">bg-color-bg-darkmode-error-secondary</div>{' '}
                <div className="text-brand-gray-500">(figma: surface-error-secondary)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-bg-darkmode-error-secondary">
                  &nbsp;
                </div>
                <p className="text-sm text-brand-gray-500">red-900</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="typography-product-heading">Border Colors</h2>
          <div className="grid grid-cols-4">
            <div>&nbsp;</div>
            <div>
              <h3 className="font-bold">Light mode</h3>
            </div>
            <div>&nbsp;</div>
            <div>
              <h3 className="font-bold">Dark mode</h3>
            </div>
          </div>
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">border-color-border-brand</div>{' '}
                <div className="text-brand-gray-500">(figma: border-brand)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-border-brand">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">fire-500</p>
              </div>
              <div>
                <div className="font-medium">border-color-border-brand</div>{' '}
                <div className="text-brand-gray-500">(figma: border-brand)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-border-brand">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">fire-500</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">border-color-border-input-lightmode</div>{' '}
                <div className="text-brand-gray-500">(figma: border-brand)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-border-input-lightmode">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-100</p>
              </div>
              <div>
                <div className="font-medium">border-color-border-input-darkmode</div>{' '}
                <div className="text-brand-gray-500">(figma: border-brand)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-border-input-darkmode">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-700</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center">
              <div>
                <div className="font-medium">border-color-border-card-lightmode</div>{' '}
                <div className="text-brand-gray-500">(figma: border-brand)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-border-card-lightmode">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-50</p>
              </div>
              <div>
                <div className="font-medium">border-color-border-card-darkmode</div>{' '}
                <div className="text-brand-gray-500">(figma: border-brand)</div>
              </div>
              <div>
                <div className="h-8 w-8 rounded-lg bg-color-border-card-darkmode">&nbsp;</div>
                <p className="text-sm text-brand-gray-500">gray-800</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-color-text-lightmode-secondary pt-6 dark:border-color-text-darkmode-secondary">
          <h2 className="typography-product-heading">Primitives</h2>
          <h3 className="my-4 font-semibold">Main</h3>
          <div className="space-y-4">
            <div>
              <h3 className="mb-1">Gray</h3>
              <div className="flex flex-wrap space-x-4">
                <PrimitiveColor
                  color={colors.paletteBrandGray.colors[0]}
                  name="Gray 0"
                  colorClassName="bg-brand-gray-0"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGray.colors[25]}
                  name="Gray 25"
                  colorClassName="bg-brand-gray-25"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGray.colors[50]}
                  name="Gray 50"
                  colorClassName="bg-brand-gray-50"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGray.colors[100]}
                  name="Gray 100"
                  colorClassName="bg-brand-gray-100"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGray.colors[200]}
                  name="Gray 200"
                  colorClassName="bg-brand-gray-200"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGray.colors[300]}
                  name="Gray 300"
                  colorClassName="bg-brand-gray-300"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGray.colors[400]}
                  name="Gray 400"
                  colorClassName="bg-brand-gray-400"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGray.colors[500]}
                  name="Gray 500"
                  colorClassName="bg-brand-gray-500"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGray.colors[600]}
                  name="Gray 600"
                  colorClassName="bg-brand-gray-600"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGray.colors[700]}
                  name="Gray 700"
                  colorClassName="bg-brand-gray-700"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGray.colors[800]}
                  name="Gray 800"
                  colorClassName="bg-brand-gray-800"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGray.colors[900]}
                  name="Gray 900"
                  colorClassName="bg-brand-gray-900"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGray.colors[1000]}
                  name="Gray 1000"
                  colorClassName="bg-brand-gray-1000"
                />
              </div>
            </div>
            <div>
              <h3 className="mb-1">Fire</h3>
              <div className="flex flex-wrap space-x-4">
                <PrimitiveColor
                  color={colors.paletteBrandFire.colors[50]}
                  name="Fire 50"
                  colorClassName="bg-brand-fire-50"
                />
                <PrimitiveColor
                  color={colors.paletteBrandFire.colors[100]}
                  name="Fire 100"
                  colorClassName="bg-brand-fire-100"
                />
                <PrimitiveColor
                  color={colors.paletteBrandFire.colors[200]}
                  name="Fire 200"
                  colorClassName="bg-brand-fire-200"
                />
                <PrimitiveColor
                  color={colors.paletteBrandFire.colors[300]}
                  name="Fire 300"
                  colorClassName="bg-brand-fire-300"
                />
                <PrimitiveColor
                  color={colors.paletteBrandFire.colors[400]}
                  name="Fire 400"
                  colorClassName="bg-brand-fire-400"
                />
                <PrimitiveColor
                  color={colors.paletteBrandFire.colors[500]}
                  name="Fire 500"
                  colorClassName="bg-brand-fire-500"
                />
                <PrimitiveColor
                  color={colors.paletteBrandFire.colors[600]}
                  name="Fire 600"
                  colorClassName="bg-brand-fire-600"
                />
                <PrimitiveColor
                  color={colors.paletteBrandFire.colors[700]}
                  name="Fire 700"
                  colorClassName="bg-brand-fire-700"
                />
                <PrimitiveColor
                  color={colors.paletteBrandFire.colors[800]}
                  name="Fire 800"
                  colorClassName="bg-brand-fire-800"
                />
                <PrimitiveColor
                  color={colors.paletteBrandFire.colors[900]}
                  name="Fire 900"
                  colorClassName="bg-brand-fire-900"
                />
              </div>
            </div>
          </div>
          <h3 className="mb-4 mt-8 font-semibold">Secondary</h3>
          <div className="space-y-4">
            <div>
              <h3 className="mb-1">Green</h3>
              <div className="flex flex-wrap space-x-4">
                <PrimitiveColor
                  color={colors.paletteBrandGreen.colors[50]}
                  name="Green 50"
                  colorClassName="bg-brand-green-50"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGreen.colors[100]}
                  name="Green 100"
                  colorClassName="bg-brand-green-100"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGreen.colors[200]}
                  name="Green 200"
                  colorClassName="bg-brand-green-200"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGreen.colors[300]}
                  name="Green 300"
                  colorClassName="bg-brand-green-300"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGreen.colors[400]}
                  name="Green 400"
                  colorClassName="bg-brand-green-400"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGreen.colors[500]}
                  name="Green 500"
                  colorClassName="bg-brand-green-500"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGreen.colors[600]}
                  name="Green 600"
                  colorClassName="bg-brand-green-600"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGreen.colors[700]}
                  name="Green 700"
                  colorClassName="bg-brand-green-700"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGreen.colors[800]}
                  name="Green 800"
                  colorClassName="bg-brand-green-800"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGreen.colors[900]}
                  name="Green 900"
                  colorClassName="bg-brand-green-900"
                />
              </div>
            </div>
            <div>
              <h3 className="mb-1">Purple</h3>
              <div className="flex flex-wrap space-x-4">
                <PrimitiveColor
                  color={colors.paletteBrandPurple.colors[50]}
                  name="Purple 50"
                  colorClassName="bg-brand-purple-50"
                />
                <PrimitiveColor
                  color={colors.paletteBrandPurple.colors[100]}
                  name="Purple 100"
                  colorClassName="bg-brand-purple-100"
                />
                <PrimitiveColor
                  color={colors.paletteBrandPurple.colors[200]}
                  name="Purple 200"
                  colorClassName="bg-brand-purple-200"
                />
                <PrimitiveColor
                  color={colors.paletteBrandPurple.colors[300]}
                  name="Purple 300"
                  colorClassName="bg-brand-purple-300"
                />
                <PrimitiveColor
                  color={colors.paletteBrandPurple.colors[400]}
                  name="Purple 400"
                  colorClassName="bg-brand-purple-400"
                />
                <PrimitiveColor
                  color={colors.paletteBrandPurple.colors[500]}
                  name="Purple 500"
                  colorClassName="bg-brand-purple-500"
                />
                <PrimitiveColor
                  color={colors.paletteBrandPurple.colors[600]}
                  name="Purple 600"
                  colorClassName="bg-brand-purple-600"
                />
                <PrimitiveColor
                  color={colors.paletteBrandPurple.colors[700]}
                  name="Purple 700"
                  colorClassName="bg-brand-purple-700"
                />
                <PrimitiveColor
                  color={colors.paletteBrandPurple.colors[800]}
                  name="Purple 800"
                  colorClassName="bg-brand-purple-800"
                />
                <PrimitiveColor
                  color={colors.paletteBrandPurple.colors[900]}
                  name="Purple 900"
                  colorClassName="bg-brand-purple-900"
                />
              </div>
            </div>
            <div>
              <h3 className="mb-1">Blue</h3>
              <div className="flex flex-wrap space-x-4">
                <PrimitiveColor
                  color={colors.paletteBrandBlue.colors[50]}
                  name="Blue 50"
                  colorClassName="bg-brand-blue-50"
                />
                <PrimitiveColor
                  color={colors.paletteBrandBlue.colors[100]}
                  name="Blue 100"
                  colorClassName="bg-brand-blue-100"
                />
                <PrimitiveColor
                  color={colors.paletteBrandBlue.colors[200]}
                  name="Blue 200"
                  colorClassName="bg-brand-blue-200"
                />
                <PrimitiveColor
                  color={colors.paletteBrandBlue.colors[300]}
                  name="Blue 300"
                  colorClassName="bg-brand-blue-300"
                />
                <PrimitiveColor
                  color={colors.paletteBrandBlue.colors[400]}
                  name="Blue 400"
                  colorClassName="bg-brand-blue-400"
                />
                <PrimitiveColor
                  color={colors.paletteBrandBlue.colors[500]}
                  name="Blue 500"
                  colorClassName="bg-brand-blue-500"
                />
                <PrimitiveColor
                  color={colors.paletteBrandBlue.colors[600]}
                  name="Blue 600"
                  colorClassName="bg-brand-blue-600"
                />
                <PrimitiveColor
                  color={colors.paletteBrandBlue.colors[700]}
                  name="Blue 700"
                  colorClassName="bg-brand-blue-700"
                />
                <PrimitiveColor
                  color={colors.paletteBrandBlue.colors[800]}
                  name="Blue 800"
                  colorClassName="bg-brand-blue-800"
                />
                <PrimitiveColor
                  color={colors.paletteBrandBlue.colors[900]}
                  name="Blue 900"
                  colorClassName="bg-brand-blue-900"
                />
              </div>
            </div>
            <div>
              <h3 className="mb-1">Yellow</h3>
              <div className="flex flex-wrap space-x-4">
                <PrimitiveColor
                  color={colors.paletteBrandYellow.colors[50]}
                  name="Yellow 50"
                  colorClassName="bg-brand-yellow-50"
                />
                <PrimitiveColor
                  color={colors.paletteBrandYellow.colors[100]}
                  name="Yellow 100"
                  colorClassName="bg-brand-yellow-100"
                />
                <PrimitiveColor
                  color={colors.paletteBrandYellow.colors[200]}
                  name="Yellow 200"
                  colorClassName="bg-brand-yellow-200"
                />
                <PrimitiveColor
                  color={colors.paletteBrandYellow.colors[300]}
                  name="Yellow 300"
                  colorClassName="bg-brand-yellow-300"
                />
                <PrimitiveColor
                  color={colors.paletteBrandYellow.colors[400]}
                  name="Yellow 400"
                  colorClassName="bg-brand-yellow-400"
                />
                <PrimitiveColor
                  color={colors.paletteBrandYellow.colors[500]}
                  name="Yellow 500"
                  colorClassName="bg-brand-yellow-500"
                />
                <PrimitiveColor
                  color={colors.paletteBrandYellow.colors[600]}
                  name="Yellow 600"
                  colorClassName="bg-brand-yellow-600"
                />
                <PrimitiveColor
                  color={colors.paletteBrandYellow.colors[700]}
                  name="Yellow 700"
                  colorClassName="bg-brand-yellow-700"
                />
                <PrimitiveColor
                  color={colors.paletteBrandYellow.colors[800]}
                  name="Yellow 800"
                  colorClassName="bg-brand-yellow-800"
                />
                <PrimitiveColor
                  color={colors.paletteBrandYellow.colors[900]}
                  name="Yellow 900"
                  colorClassName="bg-brand-yellow-900"
                />
              </div>
            </div>
            <div>
              <h3 className="mb-1">Grass</h3>
              <div className="flex flex-wrap space-x-4">
                <PrimitiveColor
                  color={colors.paletteBrandGrass.colors[50]}
                  name="Grass 50"
                  colorClassName="bg-brand-grass-50"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGrass.colors[100]}
                  name="Grass 100"
                  colorClassName="bg-brand-grass-100"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGrass.colors[200]}
                  name="Grass 200"
                  colorClassName="bg-brand-grass-200"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGrass.colors[300]}
                  name="Grass 300"
                  colorClassName="bg-brand-grass-300"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGrass.colors[400]}
                  name="Grass 400"
                  colorClassName="bg-brand-grass-400"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGrass.colors[500]}
                  name="Grass 500"
                  colorClassName="bg-brand-grass-500"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGrass.colors[600]}
                  name="Grass 600"
                  colorClassName="bg-brand-grass-600"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGrass.colors[700]}
                  name="Grass 700"
                  colorClassName="bg-brand-grass-700"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGrass.colors[800]}
                  name="Grass 800"
                  colorClassName="bg-brand-grass-800"
                />
                <PrimitiveColor
                  color={colors.paletteBrandGrass.colors[900]}
                  name="Grass 900"
                  colorClassName="bg-brand-grass-900"
                />
              </div>
            </div>
            <div>
              <h3 className="mb-1">Red</h3>
              <div className="flex flex-wrap space-x-4">
                <PrimitiveColor
                  color={colors.paletteBrandRed.colors[50]}
                  name="Red 50"
                  colorClassName="bg-brand-red-50"
                />
                <PrimitiveColor
                  color={colors.paletteBrandRed.colors[100]}
                  name="Red 100"
                  colorClassName="bg-brand-red-100"
                />
                <PrimitiveColor
                  color={colors.paletteBrandRed.colors[200]}
                  name="Red 200"
                  colorClassName="bg-brand-red-200"
                />
                <PrimitiveColor
                  color={colors.paletteBrandRed.colors[300]}
                  name="Red 300"
                  colorClassName="bg-brand-red-300"
                />
                <PrimitiveColor
                  color={colors.paletteBrandRed.colors[400]}
                  name="Red 400"
                  colorClassName="bg-brand-red-400"
                />
                <PrimitiveColor
                  color={colors.paletteBrandRed.colors[500]}
                  name="Red 500"
                  colorClassName="bg-brand-red-500"
                />
                <PrimitiveColor
                  color={colors.paletteBrandRed.colors[600]}
                  name="Red 600"
                  colorClassName="bg-brand-red-600"
                />
                <PrimitiveColor
                  color={colors.paletteBrandRed.colors[700]}
                  name="Red 700"
                  colorClassName="bg-brand-red-700"
                />
                <PrimitiveColor
                  color={colors.paletteBrandRed.colors[800]}
                  name="Red 800"
                  colorClassName="bg-brand-red-800"
                />
                <PrimitiveColor
                  color={colors.paletteBrandRed.colors[900]}
                  name="Red 900"
                  colorClassName="bg-brand-red-900"
                />
              </div>
            </div>
            <div>
              <h3 className="mb-1">Sea Blue</h3>
              <div className="flex flex-wrap space-x-4">
                <PrimitiveColor
                  color={colors.paletteBrandSeaBlue.colors[50]}
                  name="SeaBlue 50"
                  colorClassName="bg-brand-sea-blue-50"
                />
                <PrimitiveColor
                  color={colors.paletteBrandSeaBlue.colors[100]}
                  name="SeaBlue 100"
                  colorClassName="bg-brand-sea-blue-100"
                />
                <PrimitiveColor
                  color={colors.paletteBrandSeaBlue.colors[200]}
                  name="SeaBlue 200"
                  colorClassName="bg-brand-sea-blue-200"
                />
                <PrimitiveColor
                  color={colors.paletteBrandSeaBlue.colors[300]}
                  name="SeaBlue 300"
                  colorClassName="bg-brand-sea-blue-300"
                />
                <PrimitiveColor
                  color={colors.paletteBrandSeaBlue.colors[400]}
                  name="SeaBlue 400"
                  colorClassName="bg-brand-sea-blue-400"
                />
                <PrimitiveColor
                  color={colors.paletteBrandSeaBlue.colors[500]}
                  name="SeaBlue 500"
                  colorClassName="bg-brand-sea-blue-500"
                />
                <PrimitiveColor
                  color={colors.paletteBrandSeaBlue.colors[600]}
                  name="SeaBlue 600"
                  colorClassName="bg-brand-sea-blue-600"
                />
                <PrimitiveColor
                  color={colors.paletteBrandSeaBlue.colors[700]}
                  name="SeaBlue 700"
                  colorClassName="bg-brand-sea-blue-700"
                />
                <PrimitiveColor
                  color={colors.paletteBrandSeaBlue.colors[800]}
                  name="SeaBlue 800"
                  colorClassName="bg-brand-sea-blue-800"
                />
                <PrimitiveColor
                  color={colors.paletteBrandSeaBlue.colors[900]}
                  name="SeaBlue 900"
                  colorClassName="bg-brand-sea-blue-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
