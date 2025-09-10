import { useState } from "react";

export const useError = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  return { error, setError, loading, setLoading, success, setSuccess, fieldErrors, setFieldErrors };
};
