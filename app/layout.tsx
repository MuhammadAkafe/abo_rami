
import "./globals.css";
import Query_Client_Provider from "./QueryClientProvider";

export default async function RootLayout({children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
      > 
        <Query_Client_Provider>
          {children}
        </Query_Client_Provider>
      </body>
    </html>
  );
}
