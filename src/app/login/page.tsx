import LoginForm from '@/components/ui/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #1a56db 0%, #3b82f6 50%, #60a5fa 100%)'}}>
      <div className="w-full max-w-sm px-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-36 h-36 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-lg p-2">
            <img
              src="/logo-clara.png"
              alt="Raízes"
              className="w-full h-auto"
            />
          </div>
          <p className="text-white text-sm opacity-80">Pão de mel do Henrique</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
