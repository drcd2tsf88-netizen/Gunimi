type OrbitLayoutProps = {

  children:
    React.ReactNode;
};

export default function OrbitLayout({

  children,

}: OrbitLayoutProps) {

  return (

    <main

      className="

        min-h-screen
        bg-[#060816]
        text-white

      "
    >

      <div

        className="

          mx-auto
          max-w-7xl
          px-6
          py-10

          lg:px-10

        "
      >

        {children}

      </div>

    </main>
  );
}