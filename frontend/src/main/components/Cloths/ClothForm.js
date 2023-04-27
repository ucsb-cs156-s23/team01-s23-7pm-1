import React from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function ClothForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    const navigate = useNavigate();
    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker enable all
   
    const testIdPrefix = "ClothForm";

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-name"}
                    id="name"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("name", {
                        required: "Name is required.",
                        maxLength : {
                            value: 30,
                            message: "Max length 30 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="type">Type</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-type"}
                    id="type"
                    type="text"
                    isInvalid={Boolean(errors.type)}
                    {...register("type", {
                        required: "Type is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.type?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="brand">Brand</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-brand"}
                    id="brand"
                    type="text"
                    isInvalid={Boolean(errors.brand)}
                    {...register("brand", {
                        required: "Brand is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.brand?.message}
                </Form.Control.Feedback>
            </Form.Group>


            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default ClothForm;