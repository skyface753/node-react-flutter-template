import React from 'react';
import { UploadUrlRequest, UploadUrlResponse } from '../../proto/avatar_pb';
import { grpcApi } from '../../services/grpc-api/grpc-client';

type Props = {
  currentFile: File | undefined;
  progress: number;
  message: string;
  fileInfos: any;
  changeAvatarCallback: (avatar: string) => void;
};

type State = {
  currentFile: File | undefined;
  progress: number;
  message: string;
  fileInfos: any;
};

export default class AvatarUpload extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentFile: undefined,
      progress: 0,
      message: '',

      fileInfos: [],
    };

    this.selectFile = this.selectFile.bind(this);
  }

  selectFile(event: any) {
    this.setState({
      currentFile: event.target.files[0],
    });
  }

  onUploadProgress = (progressEvent: any) => {
    let percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      ),
      progress = percentCompleted;
    this.setState({ progress });
  };

  upload() {
    let currentFile = this.state.currentFile;

    this.setState({
      progress: 0,
      currentFile: currentFile,
    });
    if (currentFile === null) {
      window.alert('Please select a file');
      return;
    }
    grpcApi.avatarService
      .requestAUploadURL(
        new UploadUrlRequest().setFilename(currentFile!.name),
        null
      )
      .then(async (response: UploadUrlResponse) => {
        console.log(response.toObject());
        let uploadURL = response.getUrl();
        fetch(uploadURL, {
          method: 'PUT',
          body: currentFile,
        })
          .then((res) => {
            console.log(res);
            this.setState({
              message: 'The file was uploaded successfully!',
              currentFile: undefined,
            });
            // TODO: Update the avatar in the user settings (url from the response currently not exposed)
            this.props.changeAvatarCallback(uploadURL);
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              progress: 0,
              message: 'Could not upload the file!',
              // currentFile: undefined,
            });
          });
      });
  }

  componentDidMount() {
    // UploadService.getFiles().then((response) => {
    //   this.setState({
    //     fileInfos: response.data,
    //   });
    // });
  }

  render() {
    const { currentFile, progress, message, fileInfos } = this.state;

    return (
      <div>
        {currentFile && (
          <div className='progress'>
            <div
              className='progress-bar progress-bar-info progress-bar-striped'
              role='progressbar'
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: progress + '%' }}
            >
              {progress}%
            </div>
          </div>
        )}

        <label className='btn btn-default'>
          <input type='file' onChange={this.selectFile} />
        </label>

        <button
          className='btn btn-success'
          disabled={!currentFile}
          onClick={this.upload.bind(this)}
        >
          Upload
        </button>

        <div className='alert alert-light' role='alert'>
          {message}
        </div>

        {/* <div className='card'>
          <div className='card-header'>List of Files</div>
          <ul className='list-group list-group-flush'>
            {fileInfos &&
              fileInfos.map((file: any, index: number) => (
                <li className='list-group-item' key={index}>
                  <a href={file.url}>{file.name}</a>
                </li>
              ))}
          </ul>
        </div> */}
      </div>
    );
  }
}
