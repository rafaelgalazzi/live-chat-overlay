export interface BaseFormProps {
  children: React.ReactNode;
}

export function BaseForm({ children }: BaseFormProps) {
  return <form className="base-form">{children}</form>;
}
