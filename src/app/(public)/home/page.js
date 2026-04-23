import Navbar from "@/components/layout/navbar";
import AboutSection from "@/sections/public/home/about";
import Hero from "@/sections/public/home/hero";
import ServicesSection from "@/sections/public/home/services";
import CTASection from "@/sections/public/home/cta";
import FooterSection from "@/sections/public/home/footer";


export default function Home(){
    return(
        <main >
            <Navbar />
            <Hero />
            <AboutSection />
            <ServicesSection />
            <CTASection />
            <FooterSection />
        </main>
    )
}