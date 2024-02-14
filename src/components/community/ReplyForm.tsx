import React, { FocusEventHandler } from 'react';
import { ProfileObject, ReplyObject } from '../../pages/community/api/model';
import * as St from '../../styles/community/CommentStyle';
type ReplyFormProps = {
  addComment: any;
  isFocused: boolean;
  commentFocusHandler: FocusEventHandler<HTMLFormElement>;
  setIsFocused: (isFocused: boolean) => void;
  comment: string;
  setComment: (comment: string) => void;
  replyingToComment: ReplyObject | null;
  anon: boolean;
  setAnon: (anon: boolean) => void;
  secret: boolean;
  setSecret: (secret: boolean) => void;
  profile: ProfileObject[];
};
const ReplyForm: React.FC<ReplyFormProps> = ({
  addComment,
  isFocused,
  commentFocusHandler,
  setIsFocused,
  comment,
  setComment,
  replyingToComment,
  anon,
  setAnon,
  secret,
  setSecret,
  profile
}) => {
  return (
    <St.Form
      onSubmit={addComment}
      $isFocused={isFocused}
      onFocus={commentFocusHandler}
      onBlur={() => setIsFocused(false)}
    >
      <div>
        <St.CommentInput
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={
            profile.length > 0
              ? replyingToComment
                ? replyingToComment.anon
                  ? '익명의 작업자에게 답글 달기...'
                  : `@${
                      replyingToComment.user.nickname ??
                      replyingToComment.user.username
                    }에게 답글 달기...`
                : '댓글을 입력하세요'
              : '로그인 후에 댓글 작성이 가능합니다.'
          }
        />
        <button type="submit">
          <St.SendIcon />
        </button>
      </div>

      <St.CheckBoxArea>
        <St.AnonLabel>
          <St.CheckBoxs
            type="checkbox"
            checked={anon}
            onChange={() => setAnon(!anon)}
          />
          익명
        </St.AnonLabel>
        <St.AnonLabel>
          <St.CheckBoxs
            type="checkbox"
            checked={secret}
            onChange={() => setSecret(!secret)}
          />
          비밀
        </St.AnonLabel>
      </St.CheckBoxArea>
    </St.Form>
  );
};

export default ReplyForm;
