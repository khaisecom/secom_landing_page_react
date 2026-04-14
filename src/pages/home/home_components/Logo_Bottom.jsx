import secomLogo from '../../../assets/images/secom_text_bottom.png'

function Logo_Bottom() {
  return (
    <div className="w-full flex justify-center bg-[#0c0c0c] py-6">
      <img
        src={secomLogo}
        alt="SECOM"
        style={{
          width: '60%',
          height: 'auto',
          display: 'block',
          filter: 'grayscale(100%) brightness(0.9)',
        }}
      />
    </div>
  )
}

export default Logo_Bottom
