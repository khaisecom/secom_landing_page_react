import secomLogo from '../../../assets/images/secom_text_bottom.png'

const LOGOS = [secomLogo, secomLogo, secomLogo, secomLogo]

function Logo_Bottom() {
  return (
    <div className="w-full bg-[#0c0c0c] py-6 overflow-hidden">
      <div className="logo-marquee-track">
        {LOGOS.map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt="SECOM"
            className="mx-8"
            style={{
              width: '40vw',
              minWidth: '300px',
              height: 'auto',
              display: 'block',
              filter: 'grayscale(100%) brightness(0.9)',
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Logo_Bottom
