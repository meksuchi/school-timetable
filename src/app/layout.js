import './globals.css'

export const metadata = {
  title: 'ระบบจัดตารางเรียน',
  description: 'School Timetable Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
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
