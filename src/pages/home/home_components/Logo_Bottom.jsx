import secomLogo from '../../../assets/images/secom_logo.png'

function Logo_Bottom() {
  return (
    <div className="w-full flex justify-center bg-[#0c0c0c] py-6">
      <img
        src={secomLogo}
        alt="SECOM"
        style={{
          width: 'clamp(200px, 38vw, 680px)',
          height: 'auto',
          display: 'block',
          filter: 'grayscale(100%) brightness(0.3)',
        }}
      />
    </div>
  )
}

export default Logo_Bottom
