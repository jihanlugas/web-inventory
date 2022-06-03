import { FastField, ErrorMessage } from 'formik';
import { NextPage } from 'next';
import React from 'react';

interface Props {
	label?: string;
	name: string;
	type: string;
	required?: boolean;
}

const TextField: React.FC<Props & React.HTMLProps<HTMLInputElement>> = ({ label, name, type, required, ...props }) => {
	return (
		<div className={'flex flex-col w-full'}>
			{label && (
				<div className={''}>
					<span>{label}</span>
					{required && <span className={'text-red-600'}>{'*'}</span>}
				</div>
			)}
			<FastField
				className={'w-full border-2 rounded h-10 px-2 bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed'}
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

export default TextField;