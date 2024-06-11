import { useState } from "react";

interface ToggleButtonProps {
  label: string;
  handleToggle?: (checked: boolean) => void;
  checked?: boolean;
}

export default function ToggleButton({
    checked,
    label,
    handleToggle,
}: ToggleButtonProps) {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        if (handleToggle) handleToggle(!isChecked);
        setIsChecked(!isChecked);
    };

    return (
        <>
            <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                />
                <span className="label flex items-center text-sm font-medium text-black">
                    {label}
                </span>
                <span
                    className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
                        isChecked || checked ? "bg-primary-500" : "bg-neutral-200"
                    }`}
                >
                    <span
                        className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                            isChecked || checked ? "translate-x-[28px]" : ""
                        }`}
                    ></span>
                </span>
            </label>
        </>
    );
}
