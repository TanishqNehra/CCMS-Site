import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, Building, BarChart3, HeadphonesIcon } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="mr-4 hidden md:flex">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <Package className="h-6 w-6" />
                <span className="hidden font-bold sm:inline-block">CCCMS</span>
              </Link>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link href="/consignments" className="transition-colors hover:text-foreground/80">
                  Consignments
                </Link>
                <Link href="/trucks" className="transition-colors hover:text-foreground/80">
                  Trucks
                </Link>
                <Link href="/branches" className="transition-colors hover:text-foreground/80">
                  Branches
                </Link>
                <Link href="/reports" className="transition-colors hover:text-foreground/80">
                  Reports
                </Link>
                <Link href="/support" className="transition-colors hover:text-foreground/80">
                  Support
                </Link>
              </nav>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Courier Company Computerized Management System
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Streamline your courier operations with our comprehensive management solution
                  </p>
                </div>
                <div className="space-x-4">
                  <Button asChild>
                    <Link href="/consignments">Get Started</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section id="features" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                <Card>
                  <CardHeader>
                    <Package className="h-6 w-6 mb-2" />
                    <CardTitle>Consignment Management</CardTitle>
                    <CardDescription>Book, track, and manage consignments with ease</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Create bookings, calculate charges, track shipments in real-time, and receive status updates.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/consignments">Explore</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <Truck className="h-6 w-6 mb-2" />
                    <CardTitle>Truck Allocation</CardTitle>
                    <CardDescription>Optimize truck assignments and scheduling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Assign trucks based on consignment details, schedule dispatches, and track locations in real-time.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/trucks">Explore</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <Building className="h-6 w-6 mb-2" />
                    <CardTitle>Branch Operations</CardTitle>
                    <CardDescription>Manage branch activities and resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Track expenses, manage payroll, handle employee data, and monitor branch performance.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/branches">Explore</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <CardTitle>Reporting & Analytics</CardTitle>
                    <CardDescription>Gain insights with comprehensive reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Generate revenue reports, track KPIs, export data, and leverage AI-based analytics.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/reports">Explore</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <HeadphonesIcon className="h-6 w-6 mb-2" />
                    <CardTitle>Customer Support</CardTitle>
                    <CardDescription>Provide excellent service to customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Offer multi-channel support, maintain a knowledge base, and assist with live tracking.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/support">Explore</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <footer className="w-full border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} CCCMS. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-sm underline underline-offset-4">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm underline underline-offset-4">
                Privacy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
