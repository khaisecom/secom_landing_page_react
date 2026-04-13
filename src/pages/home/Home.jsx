import Header from '../common/Header'
import Hero from './home_components/Hero'
import Network from './home_components/Network'
import FeaturedProduct from './home_components/FeaturedProduct'
import SecomFocus from './home_components/SecomFocus'
import CoreValue from './home_components/CoreValue'
import BoardOfDirector from './home_components/BoardOfDirector'
import Recruitment from './home_components/Recruitment'
import Trusted from './home_components/Trusted'
import EndOfSun from './home_components/EndOfSun'
import Logo_Bottom from './home_components/Logo_Bottom'

function Home() {
    return (
        <div>
            <Hero />
            <Network />
            <FeaturedProduct />
            <SecomFocus />
            <CoreValue />
            <BoardOfDirector />
            <Trusted />
            <Recruitment />
            <EndOfSun />
            <Logo_Bottom/>
        </div>
    )
}

export default Home
