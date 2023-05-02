export const FormRadio = (props) => {
  const { name, value, label, onChange } = props;
  return (
    <div>
      <label>
        <input
          {...props}
          type="radio"
          name={name}
          value={value}
          onChange={onChange}
        />
        {label}
      </label>
    </div>
  );
};
