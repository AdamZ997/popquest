interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    label: string;
}

const NumberInput = ({ value, onChange, min, max, label } : NumberInputProps) => {
    return (
        <div>
            <label className="block text-gray-300 mb-2">{label}</label>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onChange(Math.max(min, value - 1))}
                    disabled={value <= min}
                    className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white font-bold text-xl transition"
                >
                    -
                </button>
                <span className="w-12 text-center text-white font-bold text-lg">{value}</span>
                <button
                    onClick={() => onChange(Math.min(max, value + 1))}
                    disabled={value >= max}
                    className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white font-bold text-xl transition"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default NumberInput;