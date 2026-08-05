import { RadioProps, RadioGroupProps } from "@/interfaces/components/input/radioButtons";
import View from "./view";
import Input from "./input";
import Text from "./text";

const Radio: React.FC<RadioProps> = ({
  value,
  label,
  name,
  checked = false,
  disabled = false,
  onChange,
  radioSize = "medium",
  variant = "default",
  id,
  style,
  className,
  ...rest
}) => {
  const radioId = id || `radio-${name}-${value}`;

  return (
    <View 
      className={`radio-container radio-${variant} ${disabled ? "radio-disabled" : ""} ${className || ""}`}
      style={style}
    >
      <Input
        type="radio"
        id={radioId}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className={`radio-input radio-${radioSize}`}
        {...rest}
      />
      <label htmlFor={radioId} className="radio-label">
        <Text as="span" className="radio-custom"></Text>
        {label}
      </label>
    </View>
  );
};

const RadioGroup: React.FC<RadioGroupProps> = ({
  options = [],
  name,
  value,
  defaultValue,
  onChange,
  disabled = false,
  direction = "vertical",
  radioSize = "medium",
  variant = "default",
  id,
  style,
  className,
  ...rest
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    // <View
    //   className={`radio-group radio-group-${direction} ${className || ""}`}
    //   role="radiogroup"
    //   aria-label={rest["aria-label"]}
    //   id={id}
    //   style={style}
    // >
    //   {options.map((option) => (
    //     <Radio
    //       key={option.value}
    //       name={name}
    //       value={option.value}
    //       label={option.label}
    //       checked={value !== undefined ? value === option.value : defaultValue === option.value}
    //       disabled={disabled || option.disabled}
    //       onChange={handleChange}
    //       radioSize={radioSize}
    //       variant={variant}
    //     />
    //   ))}
    // </View>
    <View
      className={`flex ${direction === 'horizontal' ? 'flex-row space-x-4' : 'flex-col space-y-2'} ${className || ""}`}
      role="radiogroup"
      aria-label={rest["aria-label"]}
      id={id}
      style={style}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          checked={value !== undefined ? value === option.value : defaultValue === option.value}
          disabled={disabled || option.disabled}
          onChange={handleChange}
          radioSize={radioSize}
          variant={variant}
        />
      ))}
    </View>
  );
};

export { Radio, RadioGroup };