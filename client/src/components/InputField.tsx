
const InputField = ({label,name,value,onChange,disabled}:{disabled?:boolean,label:string,name:string,value:string,onChange?:(e: React.ChangeEvent<HTMLInputElement>)=>void}) => {
  return (
    <div className="flex flex-col mb-3 sm:w-[90%] md:w-[100%]">
        <label htmlFor={name} className="text-neutral-700 self-start">
            {label}
            <span className="text-error-800">*</span>
        </label>
        <input
            disabled={disabled??false}
            type="text"
            id={name}
            name={name}
            value={value}
            placeholder={`Enter ${label}`}
            onChange={onChange}
            className="px-4 py-[15px] rounded-lg border border-neutral-400 outline-none"
        />
    </div>
  )
}

export default InputField
