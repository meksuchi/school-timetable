import './globals.css'

export const metadata = {
  title: 'ระบบจัดตารางเรียน',
  description: 'School Timetable Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#6366f1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased" style={{ fontFamily: 'Kanit, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
