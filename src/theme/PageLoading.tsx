type Props = { show: boolean }

export default function PageLoading({ show }: Props) {
  if (!show) return null

  return (
    <>
      <style>{`
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.5);
          border-top: 4px solid #9188F3;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-[99999]'>
        <div className='h-[80px] w-[80px] mx-auto'>
          <div className='spinner'></div>
        </div>
      </div>
    </>
  )
}
