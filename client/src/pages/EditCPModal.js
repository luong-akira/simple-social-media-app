import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import axios from "axios";
import "./editCPModal.css";

const EditCPModal = ({ setIsOpen }) => {
    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState();

    const onUploadCoverPicture = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (!selectedFile) {
            return toast("Please choose a photo");
        } else {
            const config = {
                headers: {
                    "x-auth-token": Cookies.get("token"),
                },
            };
            formData.append("cover", selectedFile);
            axios
                .put("/api/users/coverPicture", formData, config)
                .then((responses) => {
                    window.location.reload();
                });
        }
    };

    useEffect(() => {
        if (!selectedFile) {
            return setPreview(undefined);
        }
        const obj = URL.createObjectURL(selectedFile);
        setPreview(obj);
        return () => URL.revokeObjectURL(obj);
    }, [selectedFile]);

    return (
        <>
            <ToastContainer />
            <div className="darkBG">
                <div className="centered">
                    <form className="content" onSubmit={onUploadCoverPicture}>
                        <i
                            className="fa fa-times closeModalIcon"
                            onClick={() => setIsOpen(false)}
                        ></i>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Upload</span>
                            </div>
                            <div class="custom-file">
                                <input
                                    type="file"
                                    class="custom-file-input"
                                    id="inputCoverPicturePhoto"
                                    onChange={(e) =>
                                        setSelectedFile(e.target.files[0])
                                    }
                                />
                                <label
                                    class="custom-file-label"
                                    for="inputCoverPicturePhoto"
                                >
                                    Choose file
                                </label>
                            </div>
                        </div>
                        {selectedFile && (
                            <div className="previewImageWrapper">
                                <img src={preview} className="previewImage" />
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary">
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditCPModal;
