import Link from "next/link";



export default function BackUpBtn() {
  return (
    <Link href="/" className="absolute top-[100px] left-1/2 transform -translate-x-1/2 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      חזרה לעמוד הבית
    </Link>
  )
}