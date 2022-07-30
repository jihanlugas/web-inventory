import { Field, ErrorMessage } from 'formik';
import { NextPage } from 'next';

interface Props {
	label?: string;
	name: string;
	type: string;
	required?: boolean;
}

const TextAreaField: React.FC<Props & React.HTMLProps<HTMLTextAreaElement>> = ({ label, name, type, required, ...props }) => {
	return (
		<div className={'flex flex-col w-full'}>
			{label && (
				<div className={''}>
					<span>{label}</span>
					{required && <span className={'text-red-600'}>{'*'}</span>}
				</div>
			)}
			<Field
				as={'textarea'}
				className={'w-full border-2 rounded h-20 px-2 py-1 bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed'}
				type={type}
				name={name}
				{...props}
			/>
			<ErrorMessage name={name}>
				{(msg) => {
					return (
						<div className={'text-red-600 text-sm normal-case'}>{msg}</div>
					);
				}}
			</ErrorMessage>
		</div>
	);
};

export default TextAreaField;