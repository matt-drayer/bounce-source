const Partners = () => {
  return (
    <div className="pb-16 pl-6 pr-6 pt-2 sm:pt-16 md:pl-16 md:pr-16">
      <div className="">
        <h2 className="mb-8 text-[2.5rem] text-brand-fire-500 sm:mb-16 sm:text-[4rem]">
          Our <strong className="font-bold italic">partners</strong>
        </h2>
        <div className="flex items-center justify-center rounded-2xl bg-brand-gray-100 pb-8 pl-3 pr-3 pt-8 sm:min-h-[300px] sm:pb-0 sm:pt-0">
          <a href="https://www.thedinkpickleball.com/" target="_blank" className="mr-5 sm:mr-24">
            <img src="/images/tournaments/dink-logo.svg" alt="dink" />
          </a>
          <a href="https://www.fromuthtennis.com/" target="_blank" className="mr-5 sm:mr-24">
            <img src="/images/tournaments/fromuth-logo.svg" alt="fromuth-pickleball" />
          </a>
          <a href="https://mydupr.com/" target="_blank">
            <img src="/images/tournaments/dupr.svg" alt="dupr" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Partners;
