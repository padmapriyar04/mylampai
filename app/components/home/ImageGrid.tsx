

const ImageGrid = () => {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full max-w-[600px]">
        <div className="relative w-48 h-48 bg-[url('/home/PowerOfWize.svg')] bg-[length:600px_600px] bg-top-left rounded-tl-3xl">
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-center rounded-tl-3xl">
            <div>Types of design tools<br />20+</div>
          </div>
        </div>

        <div className="relative w-48 h-48 bg-[url('/home/PowerOfWize.svg')] bg-[length:600px_600px] bg-top-right rounded-tr-3xl">
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-center rounded-tr-3xl">
            <div>Active users every day<br />4M+</div>
          </div>
        </div>

        <div className="relative w-48 h-48 bg-[url('/home/PowerOfWize.svg')] bg-[length:600px_600px] bg-bottom-left rounded-bl-3xl">
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-center rounded-bl-3xl">
            <div>Tutorials on Moana<br />150+</div>
          </div>
        </div>

        <div className="relative w-48 h-48 bg-[url('/home/PowerOfWize.svg')] bg-[length:600px_600px] bg-bottom-right rounded-br-3xl">
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-center rounded-br-3xl">
            <div>Faster with using AI<br />74%</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ImageGrid; 