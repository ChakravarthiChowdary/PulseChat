const HomePage = () => {
  return (
    <div
      className="border w-full h-screen sm:px-[15%] sm:py-[5%]"
      data-testid="home-page-container"
    >
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative`}
        data-testid="home-page-inner-container"
      ></div>
    </div>
  );
};

export default HomePage;
