import Text from "./text";
import View from "./view";
import Upload from "./Upload";
import Button from "./button";
import { ExtendedFileItem } from "@/interfaces/components/input/uploadProps";
import {
  X,
  Camera,
  Monitor,
  Settings,
  RotateCcw,
  Smartphone,
} from "lucide-react";
import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  // useCallback,
  useImperativeHandle,
} from "react";

// Extend Window interface for garbage collection
declare global {
  interface Window {
    gc?: () => void;
  }
}

// Custom Webcam component
interface CaptureProps {
  audio?: boolean;
  className?: string;
  mirrored?: boolean;
  videoConstraints?: any;
  screenshotFormat?: string;
  screenshotQuality?: number;
}

const Capture = forwardRef<any, CaptureProps>(
  (
    {
      audio = false,
      className = "",
      mirrored = true,
      videoConstraints = {},
      screenshotFormat = "image/jpeg",
      // ...props
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
      const startCamera = async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints.facingMode
              ? { facingMode: videoConstraints.facingMode, ...videoConstraints }
              : { ...videoConstraints },
            audio,
          });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error("Camera access error:", err);
        }
      };

      startCamera();

      return () => {
        // Cleanup function to stop camera when component unmounts
        if (stream) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
          setStream(null);
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
    }, [videoConstraints, audio]);

    // useImperativeHandle(ref, () => ({
    //   getScreenshot: () => {
    //     if (!videoRef.current) return null;

    //     const video = videoRef.current as HTMLVideoElement;

    //     // Simple approach: Use HTML5 Canvas without context manipulation
    //     const canvas = document.createElement("canvas");
    //     canvas.width = video.videoWidth;
    //     canvas.height = video.videoHeight;

    //     // Handle mirroring by temporarily applying CSS transform
    //     const originalTransform = video.style.transform;

    //     if (mirrored) {
    //       // Apply mirror transform to video element
    //       video.style.transform = "scaleX(-1)";

    //       // Wait for transform to take effect, then capture
    //       setTimeout(() => {
    //         const context = canvas.getContext("2d");
    //         if (context) {
    //           context.drawImage(video, 0, 0);
    //         }

    //         // Restore original transform
    //         video.style.transform = originalTransform;
    //       }, 10);
    //     } else {
    //       const context = canvas.getContext("2d");
    //       if (context) {
    //         context.drawImage(video, 0, 0);
    //       }
    //     }

    //     return canvas.toDataURL(screenshotFormat);
    //   },
    //   stream: stream,
    //   videoRef: videoRef,
    //   stopStream: () => {
    //     console.log("🔴 stopStream called - stopping all camera tracks");

    //     // Stop the stream tracks
    //     if (stream) {
    //       stream.getTracks().forEach((track) => {
    //         console.log(
    //           "🛑 Stopping track:",
    //           track.kind,
    //           "State before:",
    //           track.readyState
    //         );
    //         track.stop();
    //         console.log("✅ Track stopped. State after:", track.readyState);
    //       });
    //       setStream(null);
    //       console.log("📝 Stream set to null");
    //     }

    //     // Also stop the video element
    //     if (videoRef.current) {
    //       console.log("📺 Clearing video element");
    //       videoRef.current.srcObject = null;
    //       videoRef.current.pause();
    //       videoRef.current.load(); // Force reload to clear any cached stream
    //       console.log("✅ Video element cleared and reloaded");
    //     }

    //     console.log("🎯 stopStream completed");
    //   },
    // }));
    useImperativeHandle(ref, () => ({
      getScreenshot: () => {
        if (!videoRef.current) return null;

        const video = videoRef.current as HTMLVideoElement;

        // Check if video is ready
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
          console.warn("Video not ready for capture");
          return null;
        }

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        if (!context) return null;

        if (mirrored) {
          // Handle mirroring in canvas context instead of manipulating video element
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
          context.drawImage(video, 0, 0);
        } else {
          context.drawImage(video, 0, 0);
        }

        return canvas.toDataURL(screenshotFormat);
      },
      stream: stream,
      videoRef: videoRef,
      stopStream: () => {
        // ... rest of your stopStream code remains the same

        if (stream) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
          setStream(null);
        }

        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.pause();
          videoRef.current.load();
        }
      },
    }));
    return (
      <video
        muted
        autoPlay
        playsInline
        ref={videoRef}
        className={className}
        style={{ transform: mirrored ? "scaleX(-1)" : "none" }}
      />
    );
  }
);

interface WebcamCaptureProps {
  name?: string;
  width?: number;
  label?: string;
  error?: string;
  accept?: string;
  height?: number;
  maxSize?: number;
  quality?: number;
  minSize?: number;
  maxCount?: number;
  maxFiles?: number;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  helperText?: string;
  browseText?: string;
  placeholder?: string;
  showPreview?: boolean;
  value?: string | null;
  showFileList?: boolean;
  showOnlyFileList?: boolean;
  // Upload component props
  maxFileNameLength?: number;
  existingFiles?: string[] | string | null;
  onUpload?: (files: File[]) => Promise<void>;
  onChange?: (fileList: ExtendedFileItem[]) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  label,
  error,
  maxSize,
  minSize,
  maxCount,
  maxFiles ,
  onChange,
  // value,
  onUpload,
  helperText,
  width = 1280,
  height = 720,
  existingFiles,
  // Upload props
  className = "",
  quality = 0.92,
  multiple = true,
  required = false,
  disabled = false,
  fullWidth = false,
  maxFileNameLength,
  accept = "image/*",
  showPreview = true,
  showFileList = true,
  showOnlyFileList = false,
  name = "webcam-image",
  browseText = "Upload Files",
  placeholder = "Click to capture image",
}) => {
  const webcamRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState("user");
  const [isCapturing, setIsCapturing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [resolution, setResolution] = useState({ width, height });
  const [fileList, setFileList] = useState<ExtendedFileItem[]>([]);

  const resolutionOptions = [
    { label: "VGA (640x480)", width: 640, height: 480 },
    { label: "HD (1280x720)", width: 1280, height: 720 },
    { label: "4K (3840x2160)", width: 3840, height: 2160 },
    { label: "Full HD (1920x1080)", width: 1920, height: 1080 },
  ];

  const videoConstraints = {
    width: resolution.width,
    height: resolution.height,
    facingMode: facingMode,
  };

  const generateUniqueId = () => {
    return `file_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  };

  const stopCameraCompletely = () => {
    try {
      const video = webcamRef.current?.videoRef?.current;

      // Step 1: Stop media tracks
      if (webcamRef.current?.stream) {
        webcamRef.current.stream
          .getTracks()
          .forEach((track: MediaStreamTrack) => {
            track.stop();
          });
        webcamRef.current.stream = null;
      }

      // Step 2: Properly unload video element
      if (video) {
        video.pause();
        video.srcObject = null;
        video.removeAttribute("src"); // critical
        video.load(); // force reinitialization
      }

      // Step 3: Dummy stream to force camera light off (only if light still on)
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        })
        .catch(() => {
          console.log("⚠️ Skipped dummy getUserMedia fallback");
        });

      // Step 4: Force full cleanup on Chrome
      setTimeout(() => {
        if (video && video.srcObject) {
          video.srcObject.getTracks().forEach((track: any) => track.stop());
          video.srcObject = null;
        }
      }, 300);

      // Step 5: Reinitialize video element to fully clear it
      setTimeout(() => {
        if (video) {
          const clone = video.cloneNode(true) as HTMLVideoElement;
          const parent = video.parentNode;
          if (parent) {
            parent.replaceChild(clone, video);
          }
        }
      }, 400);
    } catch (err) {
      console.error("❌ Error during stopCameraCompletely:", err);
    }
  };

  // const stopCameraCompletely = () => {
  //   console.log("🔴 EMERGENCY CAMERA STOP - Stopping camera completely...");
  //   // Method 1: Use our custom stopStream
  //   // if (webcamRef.current?.stopStream) {
  //   //   console.log("📞 Calling webcam stopStream method");
  //   //   webcamRef.current.stopStream();
  //   // }

  //   if (
  //     webcamRef.current &&
  //     typeof webcamRef.current.stopStream === "function"
  //   ) {
  //     console.log("📞 Calling webcam stopStream method");
  //     webcamRef.current.stopStream();
  //   } else {
  //     console.warn(
  //       "⚠️ stopStream is not available on webcamRef. Trying direct cleanup."
  //     );
  //     // fallback logic (if needed)
  //   }

  //   // Method 2: Stop stream directly if available
  //   // if (webcamRef.current?.stream) {
  //   //   console.log("🎯 Stopping stream tracks directly");
  //   //   webcamRef.current.stream
  //   //     .getTracks()
  //   //     .forEach((track: MediaStreamTrack) => {
  //   //       console.log("🛑 Force stopping track:", track.kind, track.readyState);
  //   //       track.stop();
  //   //       console.log("✅ Track force stopped:", track.readyState);
  //   //     });
  //   // }

  //   // Method 3: Clear video source directly
  //   if (webcamRef.current && webcamRef.current.videoRef?.current) {
  //     console.log("📺 Clearing video element directly");
  //     const video = webcamRef.current.videoRef.current;
  //     video.srcObject = null;
  //     video.pause();
  //     video.load();

  //     // Additional cleanup - remove all event listeners
  //     video.onloadedmetadata = null;
  //     video.onplay = null;
  //     video.onpause = null;
  //   }

  //   // Method 4: Nuclear option - try to access and stop all media devices
  //   // navigator.mediaDevices
  //   //   .enumerateDevices()
  //   //   .then((devices) => {
  //   //     console.log("📱 Available media devices:", devices.length);
  //   //     // This forces the browser to refresh its device list
  //   //   })
  //   //   .catch((err) => {
  //   //     console.log("📱 Device enumeration failed:", err);
  //   //   });

  //   // Method 5: Force garbage collection hint
  //   setTimeout(() => {
  //     if (window.gc) {
  //       console.log("🗑️ Forcing garbage collection");
  //       window.gc();
  //     }
  //   }, 100);

  //   console.log("✅ EMERGENCY CAMERA STOP COMPLETED - Camera should be OFF");
  // };

  // const checkCameraStatus = useCallback(() => {
  const checkCameraStatus = () => {
    console.log("🔍 Checking camera status...");
    if (webcamRef.current?.stream) {
      const tracks = webcamRef.current.stream.getTracks();
      tracks.forEach((track: MediaStreamTrack) => {
        console.log(
          `📹 Track ${track.kind}: ${track.readyState} (enabled: ${track.enabled})`
        );
      });

      if (
        tracks.some((track: MediaStreamTrack) => track.readyState === "live")
      ) {
        console.log("🔴 WARNING: Camera is still LIVE!");
        return false;
      }
    }
    return true;
  };
  // , [webcamRef.current?.stream]);

  // const closeModal = useCallback(() => {

  const enforceMaxFiles = (files: ExtendedFileItem[]) => {
    if (maxFiles && files.length > maxFiles) {
      return files.slice(-maxFiles); // keep only latest N
    }
    return files;
  };

  const closeModal = () => {
    setIsOpen(false);
    setShowSettings(false);
    setErrorState(null);
    stopCameraCompletely();

    //Check camera status after a brief delay
    setTimeout(() => {
      checkCameraStatus();
    }, 500);
  };
  // , [stopCameraCompletely, checkCameraStatus, isOpen, showSettings]);
  // const captureImage = useCallback(() => {
  const captureImage = () => {
    if (fileList.length >= (maxFiles || 2)) {
      setErrorState(
        `Max ${
          maxFiles || 2
        } files allowed. Please remove existing files to capture again.`
      );
      return;
    }

    setErrorState(null); // clear error if valid
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;
    // Show capturing feedback
    setIsCapturing(true);

    console.log("📸 Capturing image and stopping camera...");

    // Convert data URL to File object
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `webcam-capture-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        // Create new file item
        const newFileItem: ExtendedFileItem = {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          isExisting: false,
          id: generateUniqueId(),
        };

        // Add to file list
        // const updatedFileList = [...fileList, newFileItem];
        // setFileList(updatedFileList);

        // // Call onChange callback if provided
        // if (onChange) {
        //   onChange(updatedFileList);
        // }
        const updatedFileList = [...fileList, newFileItem];

        setFileList(updatedFileList);
        if (onChange) {
          onChange(updatedFileList);
        }
        // Call onUpload if provided
        if (onUpload) {
          onUpload([file]).catch((error) => {
            console.error("Upload error:", error);
          });
        }

        // Stop camera stream immediately after capture
        stopCameraCompletely();

        // Reset capturing state and close modal after a brief delay
        setTimeout(() => {
          setIsCapturing(false);
          setIsOpen(false);
          setShowSettings(false);

          // Check if camera is actually stopped
          setTimeout(() => {
            const isStopped = checkCameraStatus();
            if (!isStopped) {
              console.log(
                "⚠️ Camera indicator may still be on - trying additional cleanup"
              );
              // Try one more time with more aggressive cleanup
              stopCameraCompletely();
            }
          }, 200);
        }, 300); // Brief delay to show capture feedback
      })
      .catch((error) => {
        console.error("Capture error:", error);
        setIsCapturing(false);
        stopCameraCompletely();
      });
  };
  // , [
  //   fileList,
  //   onChange,
  //   onUpload,
  //   stopCameraCompletely,
  //   checkCameraStatus,
  //   isOpen,
  //   isCapturing,
  //   showSettings,
  // ]);

  const handleUploadChange = (updatedFileList: ExtendedFileItem[]) => {
    const newFileList = enforceMaxFiles(updatedFileList);

    setFileList(newFileList);

    // Clear error state when files are removed or when under max limit
    if (newFileList.length < (maxFiles || 2)) {
      setErrorState(null);
    }

    if (onChange) {
      onChange(newFileList);
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <View className={`relative ${className}`}>
      {/* Upload Component */}
      <Upload
        name={name}
        label={label}
        error={error}
        accept={accept}
        className="mb-4"
        minSize={minSize}
        maxSize={maxSize}
        multiple={multiple}
        disabled={disabled}
        maxCount={maxCount}
        required={required}
        maxFiles={maxFiles}
        fileList={fileList}
        onUpload={onUpload}
        fullWidth={fullWidth}
        helperText={helperText}
        browseText={browseText}
        showPreview={showPreview}
        showFileList={showFileList}
        showOnlyFileList={showOnlyFileList}
        existingFiles={existingFiles}
        onChange={handleUploadChange}
        maxFileNameLength={maxFileNameLength}
      />

      {/* Camera Capture Button */}
      {/* <View className="flex gap-2 w-full">
        <Button
          type="button"
          variant="ghost"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(true)}
          className={`
            flex w-full justify-center bg-white items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed transition-all duration-300
            ${disabled
              ? "opacity-50 cursor-not-allowed border-gray-300 bg-gray-50"
              : "border-blue-400 bg-blue-50 hover:border-blue-500 hover:bg-blue-100 cursor-pointer"
            }
          `}
        >
          <Camera className="w-5 h-5 text-blue-600" />
          <Text as="span" className="text-sm  font-medium text-blue-700">
            {placeholder}
          </Text>
        </Button>
      </View>
        {(errorState || error) && (
          <Text as="p" className="text-red-500 text-xs mt-1">
            {errorState || error}
          </Text>
        )} */}

      <View className="flex flex-col gap-2 w-full">
        {!showOnlyFileList && (
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            onClick={() => {
              if (disabled) return;

              // Check if max files reached before opening modal
              if (fileList.length >= (maxFiles || 2)) {
                setErrorState(
                  `Max ${
                    maxFiles || 2
                  } files allowed. Please remove existing files to capture again.`
                );
                return;
              }

              // Clear any previous errors and open modal
              setErrorState(null);
              setIsOpen(true);
            }}
            className={`
      flex w-full justify-center bg-white items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed transition-all duration-300
      ${
        disabled
          ? "opacity-50 cursor-not-allowed border-gray-300 bg-gray-50"
          : "border-blue-400 bg-blue-50 hover:border-blue-500 hover:bg-blue-100 cursor-pointer"
      }
    `}
          >
            <Camera className="w-5 h-5 text-blue-600" />
            <Text as="span" className="text-sm font-medium text-blue-700">
              {placeholder}
            </Text>
          </Button>
        )}

        {/* Show error right below the button */}
        {(errorState || error) && (
          <Text as="p" className="text-red-500 text-xs">
            {errorState || error}
          </Text>
        )}
      </View>
      {/* Camera Modal */}
      {isOpen && (
        <View className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <View className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
            {/* Header */}
            <View className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <View>
                <Text as="h3" className="text-xl font-bold text-gray-900">
                  Camera Capture
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Position yourself and click capture when ready
                </Text>
              </View>
              <View className="flex items-center gap-2">
                <Button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    showSettings
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <Button
                  onClick={closeModal}
                  className="p-3 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </Button>
              </View>
            </View>

            {/* Settings Panel */}
            {showSettings && (
              <View className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <View>
                    <Text
                      as="label"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      <Smartphone className="inline w-4 h-4 mr-2" />
                      Camera Source
                    </Text>
                    <View className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => setFacingMode("user")}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                          facingMode === "user"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        Front Camera
                      </Button>
                      <Button
                        onClick={() => setFacingMode("environment")}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                          facingMode === "environment"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        Back Camera
                      </Button>
                    </View>
                  </View>
                  <View>
                    <Text
                      as="label"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      <Monitor className="inline w-4 h-4 mr-2" />
                      Resolution
                    </Text>
                    <select
                      value={`${resolution.width}x${resolution.height}`}
                      onChange={(e) => {
                        const [width, height] = e.target.value
                          .split("x")
                          .map(Number);
                        setResolution({ width, height });
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-700 font-medium"
                    >
                      {resolutionOptions.map((res) => (
                        <option
                          key={res.label}
                          value={`${res.width}x${res.height}`}
                        >
                          {res.label}
                        </option>
                      ))}
                    </select>
                  </View>
                </View>
              </View>
            )}

            {/* Video Feed */}
            <View className="relative bg-gradient-to-br from-gray-900 to-black flex items-center justify-center min-h-[400px] p-4">
              <View className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
                <Capture
                  audio={false}
                  ref={webcamRef}
                  screenshotQuality={quality}
                  screenshotFormat="image/jpeg"
                  mirrored={facingMode === "user"}
                  videoConstraints={videoConstraints}
                  className="max-w-full max-h-[60vh] object-contain"
                />

                {/* Camera Controls Overlay */}
                <View className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <View className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-medium">
                    <View className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></View>
                    LIVE
                  </View>
                  <Button
                    onClick={switchCamera}
                    className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all duration-200"
                    title="Switch camera"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </View>

                {/* Center focus indicator */}
                <View className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <View className="w-32 h-32 border-2 border-white/30 rounded-full animate-pulse"></View>
                </View>

                {/* Capture Flash Effect */}
                {isCapturing && (
                  <View className="absolute inset-0 bg-white animate-ping opacity-75 pointer-events-none"></View>
                )}
              </View>
            </View>

            {/* Controls */}
            <View className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 flex items-center justify-center gap-4">
              <Button
                onClick={closeModal}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold border-2 border-transparent hover:border-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={captureImage}
                disabled={isCapturing}
                className={`px-10 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 ${
                  isCapturing
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700"
                }`}
              >
                <Camera
                  className={`w-5 h-5 ${isCapturing ? "animate-pulse" : ""}`}
                />
                {isCapturing ? "Capturing..." : "Capture Photo"}
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

// Export the WebcamCapture component as default
export default WebcamCapture;

// Also export the Capture component if needed
export { Capture };
