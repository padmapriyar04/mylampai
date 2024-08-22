
interface InputProps {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({name, type, placeholder, value, onChange}) => {
  return (
    <>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border-2 bg-white outline-none rounded-md text-[#222] placeholder:text-gray-400 placeholder:font-semibold  focus:border-primary-foreground font-medium border-primary-foreground hover:border-primary-foreground transition-all duration-300"
      />
    </>
  );
};

export default Input;
