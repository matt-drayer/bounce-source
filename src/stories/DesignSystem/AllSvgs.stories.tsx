import { Meta, StoryObj } from '@storybook/react';

// Dynamically import all SVG components
// @ts-ignore this worked!
const svgRequireContext = require.context('../../svg', true, /\.tsx$/);
const SvgComponents = svgRequireContext
  .keys()
  /**
   * @note the require.context was creating relative and absolute imports, so this de-dupes it
   */
  .filter((k: string) => k.includes('./'))
  .map((filename: string) => {
    const SvgComponent = svgRequireContext(filename).default;
    return { SvgComponent, name: filename.split('/').pop()?.split('.')[0] };
  });

const meta: Meta = {
  title: 'DesignSystem/SVG Icons',
  parameters: {},
};

export default meta;

type Story = StoryObj<React.ComponentType>;

export const Svgs: Story = {
  render: () => {
    return (
      <div className="grid grid-cols-10 gap-6">
        {SvgComponents.map(
          (
            {
              SvgComponent,
              name,
            }: { SvgComponent: React.FunctionComponent<{ className: string }>; name: string },
            index: number,
          ) => (
            <div key={name} className="flex flex-col items-center justify-center text-center">
              <SvgComponent className="h-8 w-8 text-black" />
              <p className="typography-product-chips-filters mt-2">{name}</p>
            </div>
          ),
        )}
      </div>
    );
  },
};
