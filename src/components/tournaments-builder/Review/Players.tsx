type Props = {};

const Players = (props: Props) => {
  const players = new Array(10).fill(null);

  return (
    <div className="border-t border-color-border-input-lightmode pt-ds-3xl dark:border-color-border-input-darkmode">
      <h3 className="typography-product-heading-compact mb-ds-2xl">Players {players.length}</h3>

      <div className="flex justify-between">
        {players.map((_, index) => {
          return (
            <div key={index} className="flex flex-col items-center">
              <img src="/images/app/empty-avatar-type-2.png" alt="avatar" />
              <span className="typography-product-button-label-small font-light text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                open
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Players;
