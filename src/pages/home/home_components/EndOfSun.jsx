import sunImg from '../../../assets/images/top_red_sun.svg'

function EndOfSun() {
  return (
    <div
      className="relative w-full overflow-hidden bg-[#0c0c0c]"
      style={{ marginTop: '-2px' }}
    >
      {/* Gradient overlay to blend top edge into background */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: '30%',
          background: 'linear-gradient(to bottom, #0c0c0c, transparent)',
        }}
      />
      <img
        src={sunImg}
        alt=""
        aria-hidden="true"
        style={{
          width: '100%',
          transform: 'rotate(180deg)',
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.4
        }}
      />
    </div>
  )
}

export default EndOfSun