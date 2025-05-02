import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";


/* --MetaData-- */
export const metadata = {
  title: 'DashStack | Dashboard',
  description: 'Manage your products in our dashboard',
  keywords: ['dashboard', 'products', 'management'],
  authors: [{ name: 'Pioneers' }],
};

export default function MainLayout({ children }) {
  return (
    <>
      <NavBar />
      <SideBar />
      <div
        className="ml-[70px] md:ml-64 transition-all duration-300 ease-in-out group-hover:md:ml-64 pt-16 px-4 sm:px-6 lg:px-8 w-[calc(100%-70px)] md:w-[calc(100%-256px)] min-h-screen"
      >
        <div
          className="max-w-full mx-auto transition-all duration-300 ease-in-out"
        >
          {children}
        </div>
      </div>
    </>
  );
}
