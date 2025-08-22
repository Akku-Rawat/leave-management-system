const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">   {/* soft page background */}
      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
};
export default Layout;
