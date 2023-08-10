import { useContext, useState } from 'react';
import { ImageContext } from "../App";
import { AddIcon } from '@chakra-ui/icons';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,useToast, useDisclosure } from '@chakra-ui/react';
import * as React from 'react';
import axios from 'axios';



const SearchField = () => {

  const [isSubmitted, setIsSubmitted] = useState(false);

	const toast = useToast();

	const { title,description, keywords  } = Input;
	const isTitleError = isSubmitted && title === '';
	const isDescriptionError = isSubmitted && description === '';
	const isKeywordsError = isSubmitted && keywords === '';

  const { isOpen, onOpen, onClose } = useDisclosure()
	const initialRef = React.useRef(null)
	const finalRef = React.useRef(null)


  const [searchValue, setSearchValue] = useState("");
  const { setSearchImage } = useContext(ImageContext);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleButtonSearch = async () => {
    try {
      if (searchValue.trim() === "") return;

      const response = await fetch(`http://localhost:3000/images/search?title=${searchValue}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const searchData = await response.json(); 
      setSearchImage(searchData.images);
    } catch (error) {
      console.error("Error searching for images:", error);
    }
  };

  const handleEnterSearch = async (e) => {
    if (e.key === "Enter") {
      handleButtonSearch();
    }
  };

  const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitted(true);
		if (title !== '' && description !== '' && keywords !== '') {
			const response = await axios.post('http://localhost:8000/adduser',{title,description,keywords})

			try {
				
				toast({
					title: "Image Addedd Successfully",
					status: "success",
					isClosable: true,
					position: "top"
				})
				onClose()
			} catch (error) {
				if(axios.isAxiosError(error)){
				console.error('Failed to upload Image:', error.response)
				}else{
				console.error('Failed to upload Image',error)
				}
				// const errorMessage = error.response?.data?.message || 'An error occured';
				toast({
					title: "Failed to upload Images",
					// description:errorMessage,
					status: "error",
					isClosable: true,
					position: "top"
				})
			}
		} else {
			toast({
				title: "Please fill in all fields",
				status: "error",
				isClosable: true,
				position: "top"
			});
		}
	}

  return (
    <div className="flex">
      <input
        className="bg-gray-50 border border-gray-300 text-sm w-full indent-2 p-2.5 outline-none focus:border-blue-500 focus:ring-2 rounded-tl rounded-bl"
        type="search"
        placeholder="Search Anything..."
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={handleEnterSearch}
      />
      <button
        onClick={handleButtonSearch}
        disabled={!searchValue}
        className="bg-blue-600 px-6 py-2.5 text-white rounded-tr rounded-br focus:ring-2 focus:ring-blue-300 disabled:bg-gray-400"
      >
        Search
      </button>
      <Button leftIcon={<AddIcon />} float='right' colorScheme='facebook' variant='action' onClick={onOpen}>
					Add New User
				</Button>
        <Modal
					initialFocusRef={initialRef}
					finalFocusRef={finalRef}
					isOpen={isOpen}
					onClose={onClose}
				>
					<form onSubmit={handleSubmit}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Add a New User</ModalHeader>
							<ModalCloseButton />
							<ModalBody pb={6}>
								<FormControl isInvalid={isTitleError}>
									<FormLabel>Title</FormLabel>
									<Input type='text' name="title" placeholder='Title' value={title} onChange={handleInputChange} />
									{isTitleError && <FormErrorMessage>Name is required.</FormErrorMessage>}
								</FormControl>
								<FormControl isInvalid={isDescriptionError} mt={4}>
									<FormLabel>Description</FormLabel>
									<Input type='description' name="description" placeholder='Description' value={description} onChange={handleInputChange} />
									{isDescriptionError && <FormErrorMessage>Email is required.</FormErrorMessage>}
								</FormControl>
								<FormControl isInvalid={isKeywordsError} mt={4}>
									<FormLabel>Kaywords</FormLabel>
									<Input type='number' name="mobileNo" placeholder='Mobile No.' value={keywords} onChange={handleInputChange} />
									{isKeywordsError && <FormErrorMessage>Mobile No. is required.</FormErrorMessage>}
								</FormControl>
                <ModalFooter>
									<Button
										variant='action'
										mr={3}
										type="submit"
									>
										Submit
									</Button>
									<Button onClick={onClose}>Cancel</Button>
								</ModalFooter>
							</ModalBody>
						</ModalContent>
            </form>
				</Modal>
    </div>
  );
};

export default SearchField;
