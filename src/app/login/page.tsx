import LoginForm from '@/components/ui/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-sm px-8">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo-escura.png"
            alt="Raízes"
            className="w-40 h-auto mb-4"
          />
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
