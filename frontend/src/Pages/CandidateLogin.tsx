import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Slice/Store";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import {
  candidateLoginUpdateField,
  candidateLoginResetField,
} from "../Slice/Slice";
import Navbar from "../components/ui/navbar"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

// Simple array of field names
const formFields = ["email", "password"] as const;
type FieldName = (typeof formFields)[number];

function CandidateLogin() {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.candidateLogin);

  const [formComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const isComplete = formFields.every(
      (field) => formData[field].trim() !== ""
    );
    setIsFormComplete(isComplete);
  }, [formData]);

  // Function to handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(
      candidateLoginUpdateField({ field: name as "email" | "password", value })
    );
  };

  // Function to handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    formFields.forEach((field) => {
      dispatch(candidateLoginResetField({ field, value: "" }));
    });
  };

  // Render the appropriate button based on form completeness
  const RenderButton = () =>
    formComplete ? (
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Login
      </Button>
    ) : (
      <Button disabled className="w-full bg-gray-300">
        Login
      </Button>
    );

  // Helper function to get field type
  const getFieldType = (field: FieldName): string =>
    field === "password" ? "password" : "email";

  // Helper function to get field label
  const getFieldLabel = (field: FieldName): string =>
    field.charAt(0).toUpperCase() + field.slice(1);

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <h2 className="text-lg font-bold">Login</h2>
            <p className="text-sm text-gray-500">
              Candidate needs to login here
            </p>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {formFields.map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {getFieldLabel(field)}
                  </label>
                  <Input
                    id={field}
                    name={field}
                    type={getFieldType(field)}
                    value={formData[field]}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <RenderButton />
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}

export default CandidateLogin;
