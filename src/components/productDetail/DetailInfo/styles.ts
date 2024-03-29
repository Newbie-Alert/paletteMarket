import { FaTrash } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import styled from 'styled-components';

const StUserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StEditBtnBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.36rem;
  cursor: pointer;
`;

const StPencilIcon = styled(FaPencil)`
  color: var(--opc-100);
`;

const StDeleteBtnBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.36rem;
  cursor: pointer;
`;

const StTrashCanIcon = styled(FaTrash)`
  color: var(--opc-100);
`;

export {
  StUserInfoWrapper,
  StEditBtnBox,
  StPencilIcon,
  StDeleteBtnBox,
  StTrashCanIcon
};
