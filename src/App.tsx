import { ChangeEvent, FC, FormEvent } from 'react';
import { TextInput } from './components/TextInput/TextInput';
import { useTextInput } from './hooks/useTextInput';
import { spacesMask } from './common/spaceMask';

export const App: FC = () => {
  const { inputProps, value } = useTextInput();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = spacesMask(e.target.value);
    inputProps?.onChange(e);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(spacesMask.unParseString(value));
  };

  return (
    <main className="App">
      <form onSubmit={onSubmit} className="Form">
        <TextInput id="input" {...inputProps} onChange={onChange} label="Numbers: " />
        <button className="Form-btn">Submit</button>
      </form>
    </main>
  );
};
