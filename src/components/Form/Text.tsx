import React, { InputHTMLAttributes, LabelHTMLAttributes } from 'react'

import classNames from 'classnames'

import './Text.css'

export const TextField = ({
    className,
    ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
    <input
        className={classNames('mr-textfield', className)}
        type={props?.type ?? 'text'}
        {...props}
    />
)

export const TextArea = ({
    className,
    ...props
}: InputHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea className={classNames('mr-textarea', className)} {...props} />
)

export const Label = ({
    className,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement>) => (
    <label className={classNames('mr-form-label', className)} {...props} />
)
