
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
        className="w-full px-3 py-2 border-2 bg-white outline-none rounded-md text-black placeholder:text-gray-400 focus:border-primary-foreground hover:border-primary-foreground transition-all duration-300"
      />
    </>
  );
};

export default Input;
