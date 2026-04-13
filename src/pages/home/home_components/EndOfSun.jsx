import sunImg from '../../../assets/images/top_red_sun.svg'

function EndOfSun() {
  return (
    <div
      className="w-full flex justify-center overflow-hidden bg-[#0c0c0c]"
      style={{ marginTop: '-2px' }}
    >
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
        }}
      />
    </div>
  )
}

export default EndOfSun